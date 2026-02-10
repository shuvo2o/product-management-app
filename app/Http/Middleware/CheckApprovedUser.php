<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckApprovedUser
{
    public function handle($request, $next)
    {
        $user = auth('api')->user();

        if ($user && $user->role === 'superadmin') {
            return $next($request);
        }

        if ($user && !$user->is_approved) {
            return response()->json(['message' => 'Your account is pending approval.'], 403);
        }

        return $next($request);
    }
}
