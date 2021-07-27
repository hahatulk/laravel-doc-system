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

    public function getInfo(UserInfoGetRequest $request) {
        $userInfo = Student::findAllInfo();
        return $this->success($userInfo[0]);
    }

    public function findOneByUserId(StudentFindOneRequest $request): \Illuminate\Http\JsonResponse {
        $vars = $request->validated();

        $userId = $vars['userId'];
        $student = Student::findOneByUserId($userId);

        if (count($student)) {
            return $this->success($student);
        } else {
            return $this->error('Not found');
        }

    }

    public function getList(StudentListRequest $request): \Illuminate\Http\JsonResponse {
        $students = Student::getInfo($request->filters);

//        if (!empty($request->filters)) {
//            $students->whereFilter($request->filters);
//        }

        return $this->success($students->paginate(6));
    }

}
