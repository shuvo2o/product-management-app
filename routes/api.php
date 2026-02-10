<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\ModeratorController;
use App\Http\Controllers\API\SuperAdminController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// ডাটা দেখার জন্য পাবলিক রাউট
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);


/*
|--------------------------------------------------------------------------
| Protected Routes (Auth & Approval Required)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:api', 'approved'])->group(function () {

    // ১. সাধারণ ইউজার রাউট
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', fn(Request $request) => $request->user());
    Route::get('/dashboard/stats', [AdminController::class, 'index']); 

    /*
    |----------------------------------------------------------------------
    | মাস্টার গ্রুপ: এই গ্রুপের ভেতরের সব কাজ শুধুমাত্র সুপারঅ্যাডমিন পারবে
    |----------------------------------------------------------------------
    */
    Route::middleware(['admin'])->group(function () {
        
        // সুপারঅ্যাডমিন ড্যাশবোর্ড
        Route::get('/superadmin/stats', [SuperAdminController::class, 'index']);
        
        // ইউজার ম্যানেজমেন্ট
        Route::controller(UserController::class)->group(function () {
            Route::get('/pending-users', 'pendingUsers');
            Route::post('/approve-user/{id}', 'approveUser');
            Route::delete('/users/{id}', 'destroy');
            Route::post('/users/{id}/assign-role', 'assignRole');
        });

        // ক্যাটাগরি ম্যানেজমেন্ট (A to Z)
        Route::post('/categories', [CategoryController::class, 'store']); // এটিই আপনার মেইন এরর ছিল
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // প্রোডাক্ট ম্যানেজমেন্ট (A to Z)
        Route::post('/products', [ProductController::class, 'store']);
        Route::post('/products/{id}', [ProductController::class, 'update']); 
        Route::delete('/products/{id}', [ProductController::class, 'delete']);
        Route::get('/stock-history', [ProductController::class, 'getStockHistory']);

        // মডারেটর স্ট্যাটাস (সুপারঅ্যাডমিন চাইলে দেখতে পারবে)
        Route::get('/moderator/stats', [ModeratorController::class, 'index']);
    });

});