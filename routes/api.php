<?php

use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ModeratorController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\SslCommerzPaymentController;
use App\Http\Controllers\API\SuperAdminController;
use App\Http\Controllers\API\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);


Route::post('/payment/success', [SslCommerzPaymentController::class, 'success']);
Route::post('/payment/fail', [SslCommerzPaymentController::class, 'fail']);
Route::post('/payment/cancel', [SslCommerzPaymentController::class, 'cancel']);
Route::post('/payment/ipn', [SslCommerzPaymentController::class, 'ipn']);


Route::middleware(['auth:api', 'approved'])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', fn(Request $request) => $request->user());
    Route::get('/dashboard/stats', [AdminController::class, 'index']);

    Route::post('/payment/initiate', [SslCommerzPaymentController::class, 'index']);
    Route::get('/orders/history', [SslCommerzPaymentController::class, 'orderHistory']);

    /*
    |----------------------------------------------------------------------
    | ৪. Admin & SuperAdmin Routes
    |----------------------------------------------------------------------
    */
    Route::middleware(['admin'])->group(function () {

        Route::get('/superadmin/stats', [SuperAdminController::class, 'index']);

        Route::controller(UserController::class)->group(function () {
            Route::get('/pending-users', 'pendingUsers');
            Route::post('/approve-user/{id}', 'approveUser');
            Route::delete('/users/{id}', 'destroy');
            Route::post('/users/{id}/assign-role', 'assignRole');
        });

        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        Route::post('/products', [ProductController::class, 'store']);
        Route::post('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'delete']);
        Route::get('/stock-history', [ProductController::class, 'getStockHistory']);

        Route::get('/moderator/stats', [ModeratorController::class, 'index']);
    });
});