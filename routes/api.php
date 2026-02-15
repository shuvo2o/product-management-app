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

/*
|--------------------------------------------------------------------------
| ১. Public Routes (সবার জন্য উন্মুক্ত)
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

/*
|--------------------------------------------------------------------------
| ২. SSLCommerz Callback Routes (এগুলো অবশ্যই পাবলিক হতে হবে)
|--------------------------------------------------------------------------
| এই রাউটগুলো CSRF এবং Auth মিডলওয়্যার থেকে মুক্ত থাকতে হবে [cite: 2026-02-15]
*/
Route::post('/payment/success', [SslCommerzPaymentController::class, 'success']);
Route::post('/payment/fail', [SslCommerzPaymentController::class, 'fail']);
Route::post('/payment/cancel', [SslCommerzPaymentController::class, 'cancel']);
Route::post('/payment/ipn', [SslCommerzPaymentController::class, 'ipn']);


/*
|--------------------------------------------------------------------------
| ৩. Protected Routes (শুধুমাত্র লগইন করা ইউজারদের জন্য)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:api', 'approved'])->group(function () {

    // ইউজার প্রোফাইল ও লগআউট
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', fn(Request $request) => $request->user());
    Route::get('/dashboard/stats', [AdminController::class, 'index']);
    
    // পেমেন্ট ইনিশিয়েট ও অর্ডার হিস্ট্রি (লগইন ছাড়া সম্ভব নয়) [cite: 2026-02-15]
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