<?php

namespace App\Http\Controllers;

use App\Imports\StudentImport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class PrikazController extends Controller
{
    public function createZachislenie(Request $request): JsonResponse
    {
        $vars = $request->validate([
            'prikazNumber' => 'required|numeric',
            'group' => 'required|exists:groups,id',
            'excelFile' => 'required|file',
        ]);

        Excel::import(new StudentImport, $request->file('excelFile'));

//        Group::create($vars);

        return $this->success('jopa');
    }
}
