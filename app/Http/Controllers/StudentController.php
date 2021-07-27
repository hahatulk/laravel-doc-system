<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudentFindOneRequest;
use App\Http\Requests\UserInfoGetRequest;
use App\Models\Student;

class StudentController extends Controller {
    public function findAll(int $id) {
        return Student::find($id);
    }


    public function getInfo(UserInfoGetRequest $request) {
        $userInfo = Student::findAllInfo($request);
        return $this->success($userInfo[0]);
    }

    public function findOneByUserId(StudentFindOneRequest $request) {
        $userId = $request->userId;
        $student = Student::findOneByUserId($userId);

        if (count($student)) {
            return $this->success($student);
        } else {
            return $this->error('Not found');
        }

    }
}
