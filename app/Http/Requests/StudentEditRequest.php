<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Http\FormRequest;

class StudentEditRequest extends FormRequest {
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
            'userId' => 'required|numeric',
            'surname' => 'string',
            'name' => 'string',
            'patronymic' => 'string',
            'gender' => 'string',
            'birthday' => 'string',
            'status' => 'numeric',
            'group' => 'numeric',
            'formaObuch' => 'numeric',
        ];
    }
}
