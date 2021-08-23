<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GroupCreateRequest extends FormRequest
{


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array {
        return [
            'kurs' => 'required|numeric',
            'name' => 'required|string|unique:groups',
            'inProgress' => 'required|numeric',
            'startDate' => 'required|date',
            'finishDate' => 'required|date',
            'groupType' => 'required|digits_between:0,1',
            'facultet' => 'required|exists:facultets,name',
        ];
    }
}
