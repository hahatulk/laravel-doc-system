<?php

namespace App\Http\Controllers;

use App\Class\StudentImportExcelReadFilter;
use App\Class\Util;
use App\Models\DefaultDocument;
use App\Models\Group;
use App\Models\Prikaz;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Exception;

class PrikazController extends Controller {
    /**
     * @throws Exception
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     */
    public function createZachislenie(Request $request): JsonResponse {
        $vars = $request->validate([
            'prikazNumber' => 'required|numeric',
            'group' => 'required|exists:groups,id',
            'prikazDate' => 'required|date',
            'excelFile' => 'required|file',
        ]);

        $students = $this->exctractStudents($vars['excelFile']);
        $studentsLength = count($students);

        $prikazInstance = DefaultDocument::whereName('prikaz_o_zachislenii')->first();
        $kursNumber = Group::find($vars['group'])->kurs;
        $kursFormatted = Util::numberToRomanRepresentation($kursNumber);
        $prikazName = 'prikaz_o_zachislenii';
        $prikazNumber = $vars['prikazNumber'];
        $prikazDefaultTitle = strtolower($prikazInstance->title);

        $prikazTitle = "Приказ №$prikazNumber $prikazDefaultTitle на $kursFormatted курс";

        $this->createPrikaz($vars['prikazNumber'], $prikazName, $prikazTitle, $vars['prikazDate']);

//        todo сделать создание акков студиков

        for ($i = 0; $i < $studentsLength; $i++) {
            $user = User::create([
                'username' => (int)User::max('username') + 1,
                'password' => 'password',
                'role' => 'student',
            ]);

            $gender =

            $insert = [
                'userId' => $user->id,
                'surname' => $students[0]->id,
                'name' => $students[0]->id,
                'patronymic' => $students[0]->id,
                'gender' => $students[0]->id,
                'birthday' => $students[0]->id,
                'group' => $students[0]->id,
                'zachislenPoPrikazu' => $prikazNumber,
                'formaObuch' => $students[0]->id,
                'status' => $students[0]->id,
            ];

            Student::create(

            );

        }


//        return response('((');
        return $this->success([
            'prikazName' => $prikazName,
            'prikazNumber' => $prikazNumber,
            'prikazTitle' => $prikazTitle,
        ]);
    }

    /**
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     * @throws Exception
     */
    private function exctractStudents($file): array {
        $fileName = $file->getClientOriginalName();
        $fileExt = pathinfo($fileName, PATHINFO_EXTENSION);

        $filterSubset = new StudentImportExcelReadFilter();

        $reader = IOFactory::createReader(ucfirst($fileExt));
        $reader->setReadFilter($filterSubset);
        $reader->setReadDataOnly(true);
        $spreadsheet = $reader->load($file);
        $worksheet = $spreadsheet->getActiveSheet();

        $highestRow = $worksheet->getHighestDataRow(); // e.g. 10
        $highestColumn = Coordinate::columnIndexFromString($worksheet->getHighestDataColumn()); // e.g. 5

        $columns = [
            'surname',
            'name',
            'patronymic',
            'gender',
            'birthday',
//            'group',
//            'zachislenPoPrikazu',
            'formaObuch',
//            'status',
        ];
        $students = [];

        //проход по строкам
        for ($row = 2; $row <= $highestRow; $row++) {
            $student = [];

            //проход по столбам
            for ($col = 1; $col <= $highestColumn; $col++) {
                $value = $worksheet->getCellByColumnAndRow($col, $row)->getValue();
                $student[$columns[$col - 1]] = trim($value);
            }

            $students[] = $student;
        }

        return $students;
    }

    private function createPrikaz(int $N, string $name, string $title, string $date) {
        $prikazCount = Prikaz::where('N', '=', $N)->count();

        if ($prikazCount === 0) {
            Prikaz::create([
                'N' => $N,
                'name' => $name,
                'title' => $title,
                'date' => $date,
            ]);
        }
    }
}
