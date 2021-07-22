<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponser {
    protected function success($data = [], string $errors = '', int $code = 200): JsonResponse {
        return response()->json([
            'errors' => $errors,
            'data' => $data
        ], $code);
    }

    protected function error(string $errors = '', int $code = 500): JsonResponse {
        return response()->json([
            'errors' => $errors,
        ], $code);
    }
}
