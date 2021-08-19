<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderFullfillRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'orderId' => 'required|numeric|exists:document_requests,id',
            'vars' => 'required|array',
        ];
    }
}
