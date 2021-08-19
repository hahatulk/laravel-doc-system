<?php


namespace App\Http\Middleware;


use Illuminate\Foundation\Http\Middleware\TransformsRequest;

class AlwaysDecodeURI extends TransformsRequest
{
    /**
     * The attributes that should not be decoded.
     *
     * @var array
     */
    protected $except = [
        //
    ];

    /**
     * Transform the given value.
     *
     * @param  string  $key
     * @param  mixed  $value
     * @return mixed
     */
    protected function transform($key, $value): mixed {
        if (in_array($key, $this->except, true)) {
            return $value;
        }

        return filter_var($value, FILTER_VALIDATE_URL) ? urldecode($value) : $value;
    }
}
