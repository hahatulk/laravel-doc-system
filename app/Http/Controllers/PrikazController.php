<?php

namespace App\Http\Controllers;

use App\Class\Util;
use App\Http\Requests\PrikazCreateRequest;
use App\Http\Requests\PrikazDeleteRequest;
use App\Http\Requests\PrikazEditRequest;
use App\Http\Requests\PrikazListRequest;
use App\Http\Requests\PrikazStudentsList;
use App\Http\Requests\PrikazZachislenieRequest;
use App\Models\DefaultDocument;
use App\Models\Group;
use App\Models\Prikaz;
use App\Models\Student;
use App\Models\User;
use Error;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PrikazController extends Controller {
    /**
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     * @throws \PhpOffice\PhpSpreadsheet\Reader\Exception
     */
    public function createZachislenie(PrikazZachislenieRequest $request): JsonResponse {
        $vars = $request->validated();

        $students = Prikaz::exctractStudents($vars['excelFile']);

        $prikazTemplate = DefaultDocument::whereName(Prikaz::PRIKAZ_ZACHISLENIE)->first();
        $kursNumber = Group::find($vars['group'])->kurs;
        $kursFormatted = Util::numberToRomanRepresentation($kursNumber);
        $prikazName = Prikaz::PRIKAZ_ZACHISLENIE;
        $prikazNumber = $vars['prikazNumber'];
        $prikazDefaultTitle = strtolower($prikazTemplate->title);

        $prikazTitle = "Приказ №$prikazNumber $prikazDefaultTitle на $kursFormatted курс";

        Prikaz::createPrikaz(
            $vars['prikazNumber'],
            $prikazName,
            $prikazTitle,
            $vars['prikazDate'],
            []
        );

        $prikaz = Prikaz::where('N', '=', $vars['prikazNumber'])->first();

        $studentIds = [];

        foreach ($students as $student) {
            $user = User::create([
                'username' => (int)User::max('username') + 1,
                'password' => Str::random(10),
                'role' => 'student',
            ]);
//
            $studentIds[] = $user->id;

            if (str_contains('женский', strtolower($student['gender']))) {
                $gender = 'женский';
            } else if (str_contains('мужской', strtolower($student['gender']))) {
                $gender = 'мужской';
            } else {
                throw new Error('Ошибка валидации gender');
            }

            if (str_contains('платная', strtolower($student['formaObuch']))) {
                $formaObuch = 1;
            } else if (str_contains('бюджетная', strtolower($student['formaObuch']))) {
                $formaObuch = 0;
            } else {
                throw new Error('Ошибка валидации formaObuch');
            }

            $insert = [
                'userId' => $user->id,
                'surname' => $student['surname'],
                'name' => $student['name'],
                'patronymic' => $student['patronymic'],
                'gender' => $gender,
                'birthday' => $student['birthday'],
                'group' => $vars['group'],
                'zachislenPoPrikazu' => $prikazNumber,
                'formaObuch' => $formaObuch,
                'status' => 0,
            ];

            Student::create(
                $insert
            );

        }
        $editPrikaz = Prikaz::find($prikaz->id);
        $editPrikaz->N = $vars['prikazNumber'];
        $editPrikaz->name = $prikazName;
        $editPrikaz->title = $prikazTitle;
        $editPrikaz->date = $vars['prikazDate'];
        $editPrikaz->userId = $studentIds;
        $editPrikaz->save();


        return $this->success([
            'prikazName' => $prikazName,
            'prikazNumber' => $prikazNumber,
            'prikazTitle' => $prikazTitle,
            'ids' => $studentIds,
        ]);
    }

    public function deletePrikaz(PrikazDeleteRequest $request): JsonResponse {
        Prikaz::destroy($request->get('id'));

        return $this->success();
    }

    public function getList(PrikazListRequest $request): JsonResponse {
        $vars = $request->validated();

        $prikazList = Prikaz::getList($request->filters, $request->sort);

        return $this->success($prikazList->paginate(6));
    }

    public function getLinkedStudentList(PrikazStudentsList $request): JsonResponse {
        $vars = $request->validated();
//        DB::enableQueryLog();
        $prikazList = Prikaz::getLinkedStudentsList($request->filters, $request->sort, $vars['prikazNumber']);
//        dd(DB::getQueryLog());
        return $this->success($prikazList->paginate(6));
    }

    public function editPrikaz(PrikazEditRequest $request): \Illuminate\Http\JsonResponse {
        $vars = $request->except('prikazId');
        $prikazId = $request->only('prikazId');
        Prikaz::where('id', '=', $prikazId)->update($vars);

        try {

        } catch (Exception $e) {
            return $this->error('Prikaz edit error');
        }
        return $this->success();
    }

    /**
     * @throws \JsonException
     */
    public function createPrikaz(PrikazCreateRequest $request): \Illuminate\Http\JsonResponse {
        $vars = $request->validated();
        $studentIds = json_decode($vars['studentIds'], true, 512, JSON_THROW_ON_ERROR);

        try {
            $created = Prikaz::createPrikaz(
                $vars['N'],
                $vars['name'],
                '',
                $vars['date'],
                $studentIds,
            );

            if (!$created) {
                return $this->error('Prikaz duplicate', [], 400);
            }
        } catch (Exception $e) {
            return $this->error('Prikaz creation error');
        }

        return $this->success();
    }

}
