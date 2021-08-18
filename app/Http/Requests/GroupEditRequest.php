<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Http\FormRequest;

class GroupEditRequest extends FormRequest {


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array {
        return [
            'groupId' => 'required|numeric',
            'values' => 'required|array',
        ];
    }
}
