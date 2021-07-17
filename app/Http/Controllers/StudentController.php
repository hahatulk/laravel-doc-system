<?php

namespace App\Http\Controllers;

use App\Models\Student;

class StudentController extends Controller
{
    public function findAll(int $id)
    {
        return Student::find($id);
    }
}
