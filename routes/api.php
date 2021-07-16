<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:api')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::middleware('auth:api')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->withoutMiddleware('auth:api');
    Route::post('/token/refresh', [AuthController::class, 'refreshToken'])->withoutMiddleware('auth:api');

    Route::post('/userget', [UserController::class, 'getAll']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout/full', [AuthController::class, 'revokeAllTokens']);
});


