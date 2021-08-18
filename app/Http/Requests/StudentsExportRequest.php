<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use JsonException;
use Request;

/**
 * @property-read array $filters
 * @property-read array sort
 * @property-read int per_page
 */
class StudentsExportRequest extends FormRequest {

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

        if (isset($input['restrictedColumns'])) {
            $input['restrictedColumns'] = json_decode($this->get('restrictedColumns'), true, 512, JSON_THROW_ON_ERROR);
        }

        if (isset($input['credentials'])) {
            $input['credentials'] = Request::boolean('credentials');
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
            'restrictedColumns' => 'array',
            'filters' => 'array',
            'sort' => 'array',
            'inProgress' => 'numeric',
            'credentials' => 'boolean',
        ];
    }
}
