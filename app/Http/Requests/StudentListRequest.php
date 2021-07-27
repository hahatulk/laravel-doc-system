<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Http\FormRequest;


/**
 * @property-read array $filters
 * @property-read int per_page
 */
class StudentListRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return Authenticatable
     */
    public function authorize(): Authenticatable {
        return auth()->user();
    }

    public function all($keys = null): array {
        $input = parent::all($keys);

        if (isset($input['filters'])) {
            $input['filters'] = json_decode($this->get('filters'), true);
        }

        return $input;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {
        return [
            'page' => 'required|numeric',
            'per_page' => 'numeric',
            'filters' => 'array',
        ];
    }
}
