<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DefaultDocumentsController;
use App\Http\Controllers\DocumentRequestController;
use App\Http\Controllers\FacultetController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\PrikazController;
use App\Http\Controllers\StudentController;
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

Route::middleware('auth:api')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->withoutMiddleware('auth:api');
    Route::post('/token/refresh', [AuthController::class, 'refreshToken'])->withoutMiddleware('auth:api');
    Route::get('/token/check', [AuthController::class, 'tokenCheck']);

    Route::get('/user/credentials', [UserController::class, 'credentials']);
    Route::post('/user/credentials/edit', [UserController::class, 'editCredentials']);


    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout/full', [AuthController::class, 'revokeAllTokens']);

    Route::get('/group/all', [GroupController::class, 'getAll']);
    Route::get('/group/list', [GroupController::class, 'getList']);
    Route::post('/group/edit', [GroupController::class, 'edit']);
    Route::post('/group/create', [GroupController::class, 'create']);
    Route::delete('/group/delete', [GroupController::class, 'delete']);

    Route::get('/user/info', [StudentController::class, 'getInfo']);

    Route::get('/student/find', [StudentController::class, 'findOneByUserId']);
    Route::get('/student/list', [StudentController::class, 'getList']);
    Route::post('/student/edit', [StudentController::class, 'editStudent']);

    Route::get('/facultet/list', [FacultetController::class, 'getAll']);

    Route::get('/orders/lk', [DocumentRequestController::class, 'lk']);
    Route::get('/orders/list', [DocumentRequestController::class, 'getOrdersList']);
    Route::post('/orders/create', [DocumentRequestController::class, 'createOrder']);
    Route::post('/orders/update', [DocumentRequestController::class, 'updateOrder']);
    Route::delete('/orders/cancel', [DocumentRequestController::class, 'cancelOrder']);


    Route::post('/prikaz/zachislenie', [PrikazController::class, 'createZachislenie']);
    Route::delete('/prikaz/delete', [PrikazController::class, 'deletePrikaz']);
    Route::get('/prikaz/list', [PrikazController::class, 'getList']);
    Route::get('/prikaz/types', [DefaultDocumentsController::class, 'getPrikazTypes']);
    Route::post('/prikaz/edit', [PrikazController::class, 'editPrikaz']);
    Route::post('/prikaz/create', [PrikazController::class, 'createPrikaz']);
    Route::get('/prikaz/students', [PrikazController::class, 'getLinkedStudentList']);
});


