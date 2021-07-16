<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class BearerToken
{
    /**
     * Handle an incoming request. Set bearer according to cookies
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $request->headers->set('Authorization', 'Bearer ' . $request->cookie('access_token'));
        return $next($request);
    }
}
