<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrdersLkRequest;
use App\Http\Requests\OrdersSummaryRequest;
use App\Models\DocumentRequest;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Request;

class DocumentRequestController extends Controller {
    public function lk(OrdersLkRequest $request) {
        if (Auth::user()->role === User::ROLE_STUDENT) {
            $query = DocumentRequest::summary();

            $this->success($query);
        }

        if (Auth::user()->role === User::ROLE_STUDENT) {
            $query = DocumentRequest::getList();

            $this->success($query);
        }
    }

}
