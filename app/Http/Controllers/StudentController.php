<?php

namespace App\Http\Controllers;

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
}
