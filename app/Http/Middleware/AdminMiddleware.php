<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle($request, $next)
    {
        $user = $request->user();

        // স্প্যাটি প্যাকেজের মেথড দিয়ে চেক করা হচ্ছে
        if ($user && $user->hasRole('superadmin', 'api')) {
            return $next($request);
        }

        return response()->json(['message' => 'Access Denied. Only SuperAdmin can perform this action.'], 403);
    }
}
