<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudentFindOneRequest;
use App\Http\Requests\StudentListRequest;
use App\Http\Requests\UserInfoGetRequest;
use App\Models\Student;
use Illuminate\Database\Eloquent\Builder;

class StudentController extends Controller {
    public function findAll(int $id) {
        return Student::find($id);
    }

    public function getInfo(UserInfoGetRequest $request): \Illuminate\Http\JsonResponse {
        $userInfo = Student::findSelf();
        return $this->success($userInfo);
    }

    public function findOneByUserId(StudentFindOneRequest $request): \Illuminate\Http\JsonResponse {
        $vars = $request->validated();

        $userId = $vars['userId'];
        $student = Student::findOneByUserId($userId);

        if (!count($student)) {
            return $this->error('Not found');
        }

        return $this->success($student);

    }

    public function getList(StudentListRequest $request): \Illuminate\Http\JsonResponse {

        $students = Student::getList($request->filters, $request->sort);

        return $this->success($students->paginate(6));
    }

}
