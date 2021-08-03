<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Http\FormRequest;

class OrdersLkRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return Authenticatable
     */
    public function authorize() {
        return auth()->user();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array {
        return [
            'page' => 'numeric',
            'per_page' => 'numeric',
            'filters' => 'array',
            'sort' => 'array',
        ];
    }
}
