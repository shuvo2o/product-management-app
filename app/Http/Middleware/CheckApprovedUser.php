<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckApprovedUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, $next)
    {
        // ১. চেক করা হচ্ছে ইউজার Passport এর মাধ্যমে অথেন্টিকেটেড কি না
        $user = auth('api')->user();

        // ২. ইউজার যদি থাকে কিন্তু সে অ্যাপ্রুভড না হয়
        if ($user && !$user->is_approved) {
            return response()->json([
                'status' => 'inactive',
                'message' => 'Your account is pending approval by the SuperAdmin/Admin.'
            ], 403);
        }

        return $next($request);
    }
}
