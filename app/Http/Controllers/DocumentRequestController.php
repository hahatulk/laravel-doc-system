<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrdersLkRequest;
use App\Models\DocumentRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class DocumentRequestController extends Controller {
    public function lk(OrdersLkRequest $request): JsonResponse {
        if (Auth::user()->role === User::ROLE_ADMIN) {
            $query = DocumentRequest::summary();

            return $this->success($query);
        }

        if (Auth::user()->role === User::ROLE_STUDENT) {
            $query = DocumentRequest::getList()->get();

            return $this->success($query);
        }

        return $this->error();

    }

}
