<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Http\FormRequest;

class PrikazCreateRequest extends FormRequest {
    public function authorize(): Authenticatable {
        return auth()->user();
    }

    public function rules(): array {
        return [
            'N' => 'required|numeric',
            'name' => 'required|exists:default_documents,name',
            'date' => 'required|date',
            'studentIds' => 'required|json',
        ];
    }
}
