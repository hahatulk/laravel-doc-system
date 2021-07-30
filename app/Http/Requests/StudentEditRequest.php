<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Http\FormRequest;

class StudentEditRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable
     */
    public function authorize()
    {
        return auth()->user();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'prikazNumber' => 'required|numeric'
        ];
    }
}
