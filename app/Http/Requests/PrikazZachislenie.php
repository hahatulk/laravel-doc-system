<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PrikazZachislenie extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable
     */
    public function authorize(): \Illuminate\Contracts\Auth\Authenticatable {
        return auth()->user();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array {
        return [
            'prikazNumber' => 'required|numeric',
            'group' => 'required|exists:groups,id',
            'prikazDate' => 'required|date',
            'excelFile' => 'required|file',
        ];
    }
}
