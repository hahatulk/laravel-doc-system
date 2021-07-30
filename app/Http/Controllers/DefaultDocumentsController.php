<?php

namespace App\Http\Controllers;

use App\Http\Requests\PrikazTypesRequest;
use App\Models\DefaultDocument;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DefaultDocumentsController extends Controller
{
    public function getPrikazTypes(PrikazTypesRequest $request): JsonResponse {
        $types = DefaultDocument::getPrikazTypes()->get();

        return $this->success($types);
    }
}
