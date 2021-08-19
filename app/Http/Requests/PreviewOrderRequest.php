<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PreviewOrderRequest extends FormRequest
{
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
            'orderId' => 'required|numeric',
            'AccessToken' => 'string',
        ];
    }
}
