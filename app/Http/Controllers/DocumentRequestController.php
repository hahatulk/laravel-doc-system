<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrdersCreateRequest;
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

    public function createOrder(OrdersCreateRequest $request) {
        $vars = $request->validated();
        $user = Auth::user();
        $allowedCounts = [
            'spravka_ob_obuchenii' => 2
        ];

        //проверка на лимит заказов
        if (DocumentRequest::orderCount($user->id, $vars['type'])->total >= $allowedCounts[$vars['type']] ) {
            return $this->error('Order limit reached');
        }

       try {
           DocumentRequest::create([
               'userId' => $user->id,
               'documentName' => $vars['type'],
               'comment' => $vars['comment'],
           ]);
       } catch (\Exception $e) {
           return $this->error('Order creation error');
       }

        return $this->success();
    }

}
