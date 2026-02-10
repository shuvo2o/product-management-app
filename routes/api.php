<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CategoryController;



/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::controller(ProductController::class)->group(function () {
    Route::get('/products', 'index');
    Route::get('/products/{id}', 'show');
});

Route::get('/categories', [CategoryController::class, 'index']);


/*
|--------------------------------------------------------------------------
| Protected Routes (Auth via Passport)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {

    // Common Auth Routes
    Route::get('/profile', fn(Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard/stats', [ProductController::class, 'getStats']);

    /*--- Superadmin Only ---*/
    Route::middleware(['role:superadmin'])->group(function () {
        Route::post('/users/{id}/assign-role', [UserController::class, 'assignRole']);
    });

    /*--- Superadmin | Admin ---*/
    Route::middleware(['role:superadmin|admin'])->group(function () {
        Route::controller(UserController::class)->group(function () {
            Route::get('/pending-users', 'pendingUsers');
            Route::post('/approve-user/{id}', 'approveUser');
            Route::post('/users/{id}/approve', 'approve');
            Route::delete('/users/{id}', 'destroy');
        });

        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
        Route::delete('/products/{id}', [ProductController::class, 'delete']);
    });

    /*--- Superadmin | Admin | Moderator ---*/
    Route::middleware(['role:superadmin|admin|moderator'])->group(function () {
        
        // Product Management
        Route::controller(ProductController::class)->group(function () {
            Route::post('/products', 'store');
            Route::post('/products/{id}', 'update'); 
            Route::get('/stock-history', 'getStockHistory');
        });

        // Category Management
        Route::controller(CategoryController::class)->group(function () {
            Route::post('/categories', 'store');
            Route::put('/categories/{id}', 'update');
        });
    });
});