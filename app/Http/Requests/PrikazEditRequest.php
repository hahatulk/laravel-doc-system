<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PrikazEditRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->user();
    }

    public function rules(): array {
        return [
            'prikazId' => 'required|numeric',
            'N' => 'string',
            'date' => 'date',
            'name' => 'string|exists:default_documents,name',
        ];
    }
}
