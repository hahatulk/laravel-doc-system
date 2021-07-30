<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Http\FormRequest;

class PrikazTypesRequest extends FormRequest {
    public function authorize(): Authenticatable {
        return auth()->user();
    }

    public function rules(): array {
        return [
            //
        ];
    }
}
