<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CategoryController;

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

    // ড্যাশবোর্ড স্ট্যাটাস (Admin, SuperAdmin, Moderator দেখতে পারবে)
    Route::get('/dashboard/stats', [ProductController::class, 'getStats']);

    /*--- ১. SuperAdmin & Admin এর কমন কাজ (Delete Power) ---*/
    Route::middleware(['role:superadmin|admin'])->group(function () {
        // ইউজার বা মডারেটর ডিলিট করার ক্ষমতা
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        
        // ক্যাটাগরি এবং প্রোডাক্ট ডিলিট করার ক্ষমতা
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
        Route::delete('/products/{id}', [ProductController::class, 'delete']);
        Route::post('/users/{id}/approve', [UserController::class, 'approve']);

        
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    /*--- ২. SuperAdmin এর এক্সক্লুসিভ কাজ ---*/
    Route::middleware(['role:superadmin'])->group(function () {
        // শুধুমাত্র সুপার এডমিন অন্যকে রোল (Admin/Moderator) এসাইন করতে পারবে
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
    // ইউজার অ্যাপ্রুভড হলে তবেই এই রাউটগুলো কাজ করবে
    // Route::middleware(['role:user', 'check.approved'])->group(function () {
    //     Route::get('/my-orders', [OrderController::class, 'index']);
    //     Route::post('/cart/add', [CartController::class, 'store']);
    // });

    // প্রোফাইল এবং লগআউট
    Route::get('/profile', function (Request $request) { return $request->user(); });
    Route::post('/logout', [AuthController::class, 'logout']);
});