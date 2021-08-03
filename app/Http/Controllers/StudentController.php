<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudentEditRequest;
use App\Http\Requests\StudentFindOneRequest;
use App\Http\Requests\StudentListRequest;
use App\Http\Requests\StudentsExportRequest;
use App\Http\Requests\UserInfoGetRequest;
use App\Models\Student;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class StudentController extends Controller {
    public function findAll(int $id) {
        return Student::find($id);
    }

    public function getInfo(UserInfoGetRequest $request): JsonResponse {
        $userInfo = Student::findSelf();
        return $this->success($userInfo);
    }

    public function findOneByUserId(StudentFindOneRequest $request): JsonResponse {
        $vars = $request->validated();

        $userId = $vars['userId'];
        $student = Student::findOneByUserId($userId);

        if (!count($student)) {
            return $this->error('Not found');
        }

        return $this->success($student);

    }

    public function getList(StudentListRequest $request): JsonResponse {
        $vars = $request->validated();

        $students = Student::getList($request->filters, $request->sort);

        if ((int)$vars['inProgress'] === 1) {
            $students = Student::whereActive($students);
        } elseif ((int)$vars['inProgress'] === 0) {
            $students = Student::whereInactive($students);
        }

        return $this->success($students->paginate(6));
    }

    public function editStudent(StudentEditRequest $request): JsonResponse {
        $vars = $request->except('userId');
        $userId = $request->only('userId');

        try {
            Student::where('userId', '=', $userId)->update($vars);

        } catch (Exception $e) {
            return $this->error('Student edit error');
        }
        return $this->success();
    }

    /**
     * @throws \PhpOffice\PhpSpreadsheet\Writer\Exception
     */
    public function exportStudents(StudentsExportRequest $request) {
        $vars = $request->validated();
        $students = Student::getList($request->filters, $request->sort);

        if ($request->inProgress === 1) {
            $students = Student::whereActive($students);
        } elseif ($request->inProgress === 0) {
            $students = Student::whereInactive($students);
        }

        $students = $students->get()->toArray();

        // Create new Spreadsheet object
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $allowedColumns = [
            "userId" => 'ID аккаунта',
            "surname" => 'Фамилия',
            "name" => 'Имя',
            "patronymic" => 'Отчество',
            "gender" => 'Пол',
            "diplomaId" => 'Номер диплома',
            "birthday" => 'Дата рождения',
            "age" => 'Возраст',
            "formaObuch" => 'Форма обучения (плат/бюдж)',
            "prikaz" => 'Зачислен по приказу №',
            "prikazDate" => 'Приказ о зачислении от',
            "groupName" => 'Группа',
            "groupType" => 'Очно/заочно',
            "kurs" => 'Курс',
            "startDate" => 'Год зачисления',
            "finishDate" => 'Год выпуска',
        ];
        $restrictedColumns = $vars['restrictedColumns'];

//        $allowedColumnsCount = count($allowedColumns);
//        for ($i = 0; $i < $allowedColumnsCount; $i++) {
//            $columnKey = array_keys($allowedColumns)[$i];
//            $columnValue = $allowedColumns[$i];
//
//            if ($columnKey === $columnValue) {
//                $sheet->setCellValue('B1', 'Фамилия');
//            }
//        }

//        if (!in_array('name', $restrictedColumns, true)) {
//            $sheet->setCellValue('B1', 'Фамилия');
//        }
//        if (!in_array('surname', $restrictedColumns, true)) {
//            $sheet->setCellValue('C1', 'Имя');
//        }
//        if (!in_array('patronymic', $restrictedColumns, true)) {
//            $sheet->setCellValue('D1', 'Отчество');
//        }
//        if (!in_array('gender', $restrictedColumns, true)) {
//            $sheet->setCellValue('E1', 'Пол');
//        }

////            if (!in_array('name', $restrictedColumns, true)) {
////                $sheet->setCellValue('B' . $rowIndex, $student->name);
////            }
////            if (!in_array('surname', $restrictedColumns, true)) {
////                $sheet->setCellValue('C' . $rowIndex, $student->surname);
////            }
////            if (!in_array('patronymic', $restrictedColumns, true)) {
////                $sheet->setCellValue('D' . $rowIndex, $student->patronymic);
////            }
////            if (!in_array('gender', $restrictedColumns, true)) {
////                $sheet->setCellValue('E' . $rowIndex, $student->gender);
////            }

        for ($i = 0, $iMax = count($students); $i < $iMax; $i++) {
            $rowIndex = $i + 2;
            $keys = array_keys($students[$i]);
            $student = $students[$i];

            $columnIndex = 1;
            for ($j = 0, $jMax = count($keys); $j < $jMax; $j++) {
                $allowedColumnsKeys = array_keys($allowedColumns);
                $columnTitle = '';

                if (!in_array($keys[$j], (array)$allowedColumnsKeys)) {
                    continue;
                }
                if (in_array($keys[$j], $restrictedColumns, true)) {
                    $columnTitle = '';
                } else {
                    $columnTitle = $allowedColumns[$keys[$j]];
                }

                if (!empty($columnTitle)) {
                    $sheet->setCellValueByColumnAndRow(
                        $columnIndex,
                        1,
                        $columnTitle,
                    );

                    $sheet->setCellValueByColumnAndRow(
                        $columnIndex,
                        $rowIndex,
                        $student[$keys[$j]],
                    );

                    $columnIndex++;
                }

            }



        }

        foreach (range('A', 'G') as $columnID) {
            $spreadsheet->getActiveSheet()->getColumnDimension($columnID)->setAutoSize(true);
        }
        //download
        $writer = new Xlsx($spreadsheet);
        $writer->save(Storage::path('export.xlsx'));

        $headers = [
            'Content-type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="export.xlsx"',
        ];

        return response()->download(Storage::path('export.xlsx'), 'export.xlsx', $headers);
    }


}
