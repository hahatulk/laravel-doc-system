<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminsCreateRequest extends FormRequest
{
    public function rules()
    {
        return [
            'fio' => 'required|string',
            'password' => ''
        ];
    }
}
