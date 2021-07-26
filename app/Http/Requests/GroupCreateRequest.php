<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Http\FormRequest;

class GroupCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return Authenticatable
     */
    public function authorize(): Authenticatable {
        return auth()->user();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array {
        return [
            'kurs' => 'required|numeric',
            'name' => 'required|string|unique:groups',
            'startDate' => 'required|date',
            'finishDate' => 'required|date',
            'groupType' => 'required|digits_between:0,1',
            'facultet' => 'required|exists:facultets,name',
        ];
    }
}
