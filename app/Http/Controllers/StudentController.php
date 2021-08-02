<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudentEditRequest;
use App\Http\Requests\StudentFindOneRequest;
use App\Http\Requests\StudentListRequest;
use App\Http\Requests\UserInfoGetRequest;
use App\Models\Prikaz;
use App\Models\Student;
use App\Models\User;
use Exception;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

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
        $vars = $request->validated();

        $students = Student::getList($request->filters, $request->sort);

        if ((int)$vars['inProgress'] === 1) {
            $students = Student::whereActive($students);
        } elseif ((int)$vars['inProgress'] === 0) {
            $students = Student::whereInactive($students);
        }

//        return $this->success(Student::find(3)->prikazs);
        return $this->success($students->paginate(6));
    }

    public function editStudent(StudentEditRequest $request): \Illuminate\Http\JsonResponse {
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
    public function exportStudents() {
        {
            $students = Student::all();

            // Create new Spreadsheet object
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            // Set document properties
//            $spreadsheet->getProperties()->setCreator('miraimedia.co.th')
//                ->setLastModifiedBy('Cholcool')
//                ->setTitle('how to export data to excel use phpspreadsheet in codeigniter')
//                ->setSubject('Generate Excel use PhpSpreadsheet in CodeIgniter')
//                ->setDescription('Export data to Excel Work for me!');
            // add style to the header
//            $styleArray = array(
//                'font' => array(
//                    'bold' => true,
//                ),
//                'alignment' => array(
//                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
//                    'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
//                ),
//                'borders' => array(
//                    'bottom' => array(
//                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THICK,
//                        'color' => array('rgb' => '333333'),
//                    ),
//                ),
//                'fill' => array(
//                    'type' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
//                    'rotation' => 90,
//                    'startcolor' => array('rgb' => '0d0d0d'),
//                    'endColor' => array('rgb' => 'f2f2f2'),
//                ),
//            );
//            $spreadsheet->getActiveSheet()->getStyle('A1:G1')->applyFromArray($styleArray);
            // auto fit column to content
            foreach (range('A', 'G') as $columnID) {
                $spreadsheet->getActiveSheet()->getColumnDimension($columnID)->setAutoSize(true);
            }
            // set the names of header cells
            $sheet->setCellValue('A1', 'ID');
            $sheet->setCellValue('B1', 'Фамилия');
            $sheet->setCellValue('C1', 'Имя');
            $sheet->setCellValue('D1', 'Отчество');
            $sheet->setCellValue('E1', 'Пол');
//            $sheet->setCellValue('F1', 'Phone');
//            $sheet->setCellValue('G1', 'Email');
//            $getdata = $this->welcome_message->get_sample();
            // Add some data

            $x = 2;
            foreach ($students as $student) {
                $sheet->setCellValue('A' . $x, $student->id);
                $sheet->setCellValue('B' . $x, $student->name);
                $sheet->setCellValue('C' . $x, $student->surname);
                $sheet->setCellValue('D' . $x, $student->patronymic);
                $sheet->setCellValue('E' . $x, $student->gender);
                $x++;
            }
            //Create file excel.xlsx
            $writer = new Xlsx($spreadsheet);
            $writer->save('test.xlsx');
            //End Function index
        }
    }

}
