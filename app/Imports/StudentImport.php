<?php

namespace App\Imports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\ToModel;

class StudentImport implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row): \Illuminate\Database\Eloquent\Model|Student|null
    {
        return new Student([
            'userId' => $row[0],
            'surname' => $row[0],
            'name' => $row[0],
            'patronymic' => $row[0],
            'gender' => $row[0],
            'birthday' => $row[0],
            'group' => $row[0],
            'zachislenPoPrikazu' => $row[0],
            'formaObuch' => $row[0],
            'status' => $row[0],
        ]);
    }
}
