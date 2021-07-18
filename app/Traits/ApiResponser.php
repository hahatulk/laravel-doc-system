<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponser
{
    protected function success($data = [], $errors = null, $code = 200): JsonResponse
    {

        return response()->json([
            'errors' => $errors,
            'data' => $data
        ], $code);
    }

    protected function error(string|null $errors = null, int $code = 500): JsonResponse
    {
        return response()->json([
            'errors' => $errors,
        ], $code);
    }
}
