<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderCancelRequest;
use App\Http\Requests\OrdersCreateRequest;
use App\Http\Requests\OrdersListRequest;
use App\Http\Requests\OrdersLkRequest;
use App\Models\DocumentRequest;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

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

    public function getOrdersList(OrdersListRequest $request): JsonResponse {
        $vars = $request->validated();
        $list = DocumentRequest::getList($request->filters, $request->sort);
        return $this->success($list->paginate(6));
    }
}
