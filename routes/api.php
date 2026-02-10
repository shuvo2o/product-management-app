<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\User\UserController;

/*
|--------------------------------------------------------------------------
| Public Routes 
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);


/*
|--------------------------------------------------------------------------
| Protected Routes 
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {

    Route::get('/dashboard/stats', [ProductController::class, 'getStats']);

    Route::middleware(['role:superadmin|admin'])->group(function () {
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
        Route::delete('/products/{id}', [ProductController::class, 'delete']);
        Route::post('/users/{id}/approve', [UserController::class, 'approve']);

        Route::get('/pending-users', [UserController::class, 'pendingUsers']);
        Route::post('/approve-user/{id}', [UserController::class, 'approveUser']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    Route::middleware(['role:superadmin'])->group(function () {
        Route::post('/users/{id}/assign-role', [UserController::class, 'assignRole']);
    });

    /*--- ৩. Create & Update (Admin + Moderator + SuperAdmin) ---*/
    Route::middleware(['role:superadmin|admin|moderator'])->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::post('/products/{id}', [ProductController::class, 'update']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
    });

    /*--- ৪. General User (Customer) Routes ---*/
    // Route::middleware(['role:user', 'check.approved'])->group(function () {
    //     Route::get('/my-orders', [OrderController::class, 'index']);
    //     Route::post('/cart/add', [CartController::class, 'store']);
    // });

    Route::get('/profile', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
});
