<?php

namespace App\Http\Controllers;

use App\Class\StudentImportExcelReadFilter;
use App\Class\Util;
use App\Models\DefaultDocument;
use App\Models\Group;
use App\Models\Prikaz;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Exception;

class PrikazController extends Controller {
    /**
     * @throws Exception
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     */
    public function createZachislenie(Request $request) {
        $vars = $request->validate([
            'prikazNumber' => 'required|numeric',
            'group' => 'required|exists:groups,id',
            'prikazDate' => 'required|date',
            'excelFile' => 'required|file',
        ]);

        $students = $this->exctractStudents($vars['excelFile']);

        $prikazInstance = DefaultDocument::whereName('prikaz_o_zachislenii')->first();
        $kursNumber = Group::find($vars['group'])->kurs;
        $kursFormatted = Util::numberToRomanRepresentation($kursNumber);
        $prikazName = 'prikaz_o_zachislenii';
        $prikazNumber = $vars['prikazNumber'];
        $prikazDefaultTitle = strtolower($prikazInstance->title);

        $prikazTitle = "Приказ №$prikazNumber $prikazDefaultTitle на $kursFormatted курс";

        $this->createPrikaz($vars['prikazNumber'], $prikazName, $prikazTitle, $vars['prikazDate']);

        return response('((');
//        return $this->success();
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
