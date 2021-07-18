<?php

namespace App\Class;

class StudentImportExcelReadFilter implements \PhpOffice\PhpSpreadsheet\Reader\IReadFilter
{
    /**
     * @inheritDoc
     */
    public function readCell($column, $row, $worksheetName = ''): bool
    {
        //  Read rows 1 to 7 and columns A to E only
        if ($row >= 1) {
            if (in_array($column, range('A', 'F'), true)) {
                return true;
            }
        }
        return false;
    }
}
