<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;


class StudentEditRequest extends FormRequest {


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'userId' => 'required|numeric',
            'birthday' => 'nullable|date',
            'gender' => 'nullable|string',
            'group' => 'nullable|exists:groups,id',
            'surname' => 'nullable|string',
            'name' => 'nullable|string',
            'patronymic' => 'nullable|string',
        ];
    }
}
