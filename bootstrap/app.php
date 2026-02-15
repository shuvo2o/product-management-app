<?php

use Illuminate\Foundation\Application;
use App\Http\Middleware\CheckApprovedUser;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\ModeratorMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Spatie\Permission\Middleware\PermissionMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'approved' => \App\Http\Middleware\CheckApprovedUser::class,
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'moderator' => \App\Http\Middleware\ModeratorMiddleware::class,
        ]);
        $middleware->validateCsrfTokens(except: [
            '/api/payment/success',
            '/api/payment/fail',
            '/api/payment/cancel',
            '/api/payment/ipn',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
