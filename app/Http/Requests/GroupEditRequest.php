<?php

namespace App\Http\Requests;

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
            'facultet' => 'nullable|string',
            'groupType' => 'nullable|numeric',
            'inProgress' => 'nullable|numeric',
        ];
    }
}
