<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrikazController extends Controller
{
    public function create(Request $request): JsonResponse
    {
        $vars = $request->validate([
            'prikazNumber' => 'required|numeric',
            'group' => 'required|exists:groups,id',
            'excelFile' => 'required|file',
        ]);

//        Group::create($vars);

        return $this->success('jopa');
    }
}
