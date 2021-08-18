<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use JsonException;

class PrikazStudentsList extends FormRequest {
    public function authorize(): \Illuminate\Contracts\Auth\Authenticatable {
        return auth()->user();
    }
     /**
     * @throws JsonException
     */
    public function all($keys = null): array {
        $input = parent::all($keys);

        if (isset($input['filters'])) {
            $input['filters'] = json_decode($this->get('filters'), true, 512, JSON_THROW_ON_ERROR);
        }

        if (isset($input['sort'])) {
            $input['sort'] = json_decode($this->get('sort'), true, 512, JSON_THROW_ON_ERROR);
        }

        return $input;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array {
        return [
            'page' => 'required|numeric',
            'per_page' => 'numeric',
            'filters' => 'array',
            'sort' => 'array',
            'prikazNumber' => 'required|numeric'
        ];
    }
}
