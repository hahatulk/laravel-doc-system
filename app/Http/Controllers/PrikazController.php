<?php

namespace App\Http\Controllers;

use App\Class\StudentImportExcelReadFilter;
use App\Class\Util;
use App\Http\Requests\PrikazDeleteRequest;
use App\Http\Requests\PrikazZachislenieRequest;
use App\Models\DefaultDocument;
use App\Models\Group;
use App\Models\Prikaz;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Exception;

class PrikazController extends Controller {
    /**
     * @throws Exception
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     */
    public function createZachislenie(PrikazZachislenieRequest $request): JsonResponse {
        $vars = $request->validated();

        $students = $this->exctractStudents($vars['excelFile']);

        $prikazInstance = DefaultDocument::whereName('prikaz_o_zachislenii')->first();
        $kursNumber = Group::find($vars['group'])->kurs;
        $kursFormatted = Util::numberToRomanRepresentation($kursNumber);
        $prikazName = 'prikaz_o_zachislenii';
        $prikazNumber = $vars['prikazNumber'];
        $prikazDefaultTitle = strtolower($prikazInstance->title);

        $prikazTitle = "Приказ №$prikazNumber $prikazDefaultTitle на $kursFormatted курс";

        $this->createPrikaz($vars['prikazNumber'], $prikazName, $prikazTitle, $vars['prikazDate']);

        foreach ($students as $student) {
            $user = User::create([
                'username' => (int)User::max('username') + 1,
                'password' => Str::random(10),
                'role' => 'student',
            ]);

            if (str_contains('женский', strtolower($student['gender']))) {
                $gender = 'женский';
            } else if (str_contains('мужской', strtolower($student['gender']))) {
                $gender = 'мужской';
            } else {
                throw new \Error('Ошибка валидации gender');
            }

            if (str_contains('платная', strtolower($student['formaObuch']))) {
                $formaObuch = 1;
            } else if (str_contains('бюджетная', strtolower($student['formaObuch']))) {
                $formaObuch = 0;
            } else {
                throw new \Error('Ошибка валидации formaObuch');
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

    private function createPrikaz(int $N, string $name, string $title, string $date): void {
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

    public function deletePrikaz(PrikazDeleteRequest $request): JsonResponse {

        $prikaz = Prikaz::select('id')
            ->where('N', '=', $request->get('prikazNumber'))
            ->get();

        if (!count($prikaz)) {
            return $this->error('Prikaz not found');
        }

        Prikaz::destroy($prikaz[0]->id);

        return $this->success();
    }
}
