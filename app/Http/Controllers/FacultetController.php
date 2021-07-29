<?php

namespace App\Http\Controllers;

use App\Http\Requests\FacultetListRequest;
use App\Models\Facultet;
use Illuminate\Http\JsonResponse;

class FacultetController extends Controller {
    //
    public function getAll(FacultetListRequest $request): JsonResponse {
        return $this->success(Facultet::all());
    }
}
