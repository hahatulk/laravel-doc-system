<?php

namespace App\Http\Controllers;

use App\Class\PatchedTemplateProcessor;
use App\Http\Requests\OrderCancelRequest;
use App\Http\Requests\OrderPrepareRequest;
use App\Http\Requests\OrdersCreateRequest;
use App\Http\Requests\OrdersListRequest;
use App\Http\Requests\OrdersLkRequest;
use App\Http\Requests\OrderUpdateRequest;
use App\Http\Requests\PreviewOrderRequest;
use App\Models\DocumentRequest;
use App\Models\Prikaz;
use App\Models\Student;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Petrovich;
use PhpOffice\PhpWord\TemplateProcessor;
use Request;
use Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DocumentRequestController extends Controller {
    public function lk(OrdersLkRequest $request): JsonResponse {
        $user = Auth::user();
        if ($user->role === User::ROLE_ADMIN) {
            $query = DocumentRequest::summary()->get();

            return $this->success($query);
        }

        if ($user->role === User::ROLE_STUDENT) {
            $query = DocumentRequest::getList()
                ->where(
                    'userId', $user->id
                )
                ->get();

            return $this->success($query);
        }

        return $this->error();

    }

    public function createOrder(OrdersCreateRequest $request): JsonResponse {
        $vars = $request->validated();

        $user = Auth::user();

        $allowedCounts = [
            DocumentRequest::SPRAVKA_OB_OBUCHENII => 2
        ];

        $usedCount = DocumentRequest::orderCount($user->id, $vars['type'])->get()[0]->total;

        //проверка на лимит заказов
        if ($usedCount >= $allowedCounts[$vars['type']]) {
            return $this->error('Orders limit reached');
        }

        if ($vars['count'] > $allowedCounts[$vars['type']] - $usedCount) {
            return $this->error('Orders count is more than can order', [
                'left' => $usedCount
            ]);
        }

        try {
            for ($i = 0; $i < $vars['count']; $i++) {
                DocumentRequest::create([
                    'userId' => $user->id,
                    'documentName' => $vars['type'],
                    'comment' => $vars['comment'],
                ]);
            }
        } catch (Exception $e) {
            return $this->error('Order creation error');
        }

        return $this->success();
    }

    public function cancelOrder(OrderCancelRequest $request): JsonResponse {
        $vars = $request->validated();
        $user = Auth::user();
        $userRequests = count(DocumentRequest::where([
            ['id', '=', $vars['orderId']],
            ['userId', '=', $user->id],
        ])->get());

        if (($user->role !== User::ROLE_ADMIN) && !$userRequests) {
            return $this->error('Forbidden', [], 403);
        }

        try {
            DocumentRequest::destroy($vars['orderId']);
        } catch (Exception $e) {
            return $this->error('Order destruction error');
        }

        return $this->success();
    }

    public function updateOrder(OrderUpdateRequest $request): JsonResponse {
        $vars = $request->validated();
        $user = Auth::user();

        try {
            $order = DocumentRequest::find($vars['orderId']);
            $order->status = (int)$vars['status'];
            $order->save();
        } catch (Exception $e) {
            return $this->error('Order update error');
        }

        return $this->success($order);
    }

    public function getOrdersList(OrdersListRequest $request): JsonResponse {
        $vars = $request->validated();
        $orders = DocumentRequest::getList($request->filters, $request->sort);

        if (isset($vars['active'])) {
            if ((int)$vars['active'] === 1) {
                $orders = DocumentRequest::whereActive($orders);
            } elseif ((int)$vars['active'] === 0) {
                $orders = DocumentRequest::whereInactive($orders);
            }
        }


        return $this->success($orders->paginate(6));
    }

    /**
     * @throws Exception
     */
    public function prepareOrder(OrderPrepareRequest $request): JsonResponse {
        $order = DocumentRequest::whereId($request->orderId)
            ->with(['default_document'])
            ->first();
        if (empty($order)) {
            abort('order not found', 404);
        }

        $student = Student::where('userId', $order->userId)
            ->with(['prikazs.default_document', 'groups'])
            ->first();

        if (empty($student)) {
            abort('student not found', 404);
        }

        $petrovich = new Petrovich();
        $docType = $order->documentName;
        $fileName = $order->id;
        $studentName = 'TestName';
        $gender = $student->gender === 'мужской' ? Petrovich::GENDER_MALE : Petrovich::GENDER_FEMALE;
        $case = Petrovich::CASE_GENITIVE;

        $vars = [
            'Фамилия' => $petrovich->firstname($student->surname, $case, $gender),
            'Имя' => $petrovich->lastname($student->name, $case, $gender),
            'Отчество' => $petrovich->middlename($student->patronymic, $case, $gender),
            'Курс' => $student->groups->kurs,
            'Группа' => $student->groups->name,
            'ФормаОбучения' => $student->groups->groupType ? 'заочного' : 'очного (дневного)',
            'БюджетПлат' => $student->formaObuch ? 'платной' : 'бюджетной',
            'НачалоУчебы' => Carbon::createFromDate($student->groups->startDate)->format('d.m.Y'),
            'КонецУчебы' => Carbon::createFromDate($student->groups->finishDate)->format('d.m.Y'),
            'Приказы' => collect($student->prikazs)->map(function (Prikaz $el) {
                $defaultTitle = $el->default_document->title;
                return [
                    'Номер' => $el->N,
                    "Название" => $defaultTitle,
                    "Дата" => Carbon::createFromDate($el->date)->format('d.m.Y'),
                ];
            }),
        ];

        $templateProcessor = new PatchedTemplateProcessor(Storage::path("templates/$docType.docx"));
        $templateProcessor->cloneBlock('Приказ', 10, true, false, $vars['Приказы']->toArray());
        $templateProcessor->setValues($vars);

        $templateProcessor->saveAs(Storage::path("orders/$fileName.docx"));
        return $this->success([
            'orderId' => $order->id,
            'previewToken' => $request->cookie('access_token'),
            'vars' => $vars,
        ]);
    }

    public function fullFillOrder(OrderPrepareRequest $request): JsonResponse {
        $order = DocumentRequest::whereId($request->orderId)
            ->with(['default_document'])
            ->first();
        if (empty($order)) {
            abort('order not found', 404);
        }

        $student = Student::where('userId', $order->userId)
            ->with(['prikazs.default_document', 'groups'])
            ->first();

        if (empty($student)) {
            abort('student not found', 404);
        }

        $petrovich = new Petrovich();
        $docType = $order->documentName;
        $fileName = $order->id;
        $studentName = 'TestName';
        $gender = $student->gender === 'мужской' ? Petrovich::GENDER_MALE : Petrovich::GENDER_FEMALE;
        $case = Petrovich::CASE_GENITIVE;

        $vars = [
            'Фамилия' => $petrovich->firstname($student->surname, $case, $gender),
            'Имя' => $petrovich->lastname($student->name, $case, $gender),
            'Отчество' => $petrovich->middlename($student->patronymic, $case, $gender),
            'Курс' => $student->groups->kurs,
            'Группа' => $student->groups->name,
            'ФормаОбучения' => $student->groups->groupType ? 'заочного' : 'очного (дневного)',
            'БюджетПлат' => $student->formaObuch ? 'платной' : 'бюджетной',
            'НачалоУчебы' => Carbon::createFromDate($student->groups->startDate)->format('d.m.Y'),
            'КонецУчебы' => Carbon::createFromDate($student->groups->finishDate)->format('d.m.Y'),
            'Приказы' => collect($student->prikazs)->map(function (Prikaz $el) {
                $defaultTitle = $el->default_document->title;
                return [
                    'Номер' => $el->N,
                    "Название" => $defaultTitle,
                    "Дата" => Carbon::createFromDate($el->date)->format('d.m.Y'),
                ];
            }),
        ];

        $templateProcessor = new PatchedTemplateProcessor(Storage::path("templates/$docType.docx"));
        $templateProcessor->cloneBlock('Приказ', 10, true, false, $vars['Приказы']->toArray());
        $templateProcessor->setValues($vars);

        $templateProcessor->saveAs(Storage::path("orders/$fileName.docx"));
        return $this->success();
    }

    public function previewOrder(PreviewOrderRequest $request): BinaryFileResponse {
        $headers = [
            'Content-type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition' => 'attachment; filename="order.docx"',
        ];

        return response()->download(Storage::path($request->orderId . '.docx'), 'preview.docx', $headers);
    }
}
