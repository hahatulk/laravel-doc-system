<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\DocumentRequestController;
use App\Http\Controllers\PrikazController;
use App\Http\Controllers\StudentController;
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

Route::middleware('auth:api')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->withoutMiddleware('auth:api');
    Route::post('/token/refresh', [AuthController::class, 'refreshToken'])->withoutMiddleware('auth:api');
    Route::get('/token/check', [AuthController::class, 'tokenCheck']);


    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout/full', [AuthController::class, 'revokeAllTokens']);

//    Route::post('/group/list', [GroupController::class, 'findAllWithSortFilter']);
    Route::post('/group/edit', [GroupController::class, 'edit']);
    Route::post('/group/create', [GroupController::class, 'create']);
    Route::delete('/group/delete', [GroupController::class, 'delete']);

    Route::get('/user/info', [StudentController::class, 'getInfo']);

    Route::get('/student/find', [StudentController::class, 'findOneByUserId']);
    Route::get('/student/list', [StudentController::class, 'getList']);

    Route::get('/orders/lk', [DocumentRequestController::class, 'lk']);


    Route::post('/prikaz/zachislenie', [PrikazController::class, 'createZachislenie']);
    Route::delete('/prikaz/delete', [PrikazController::class, 'deletePrikaz']);
});


