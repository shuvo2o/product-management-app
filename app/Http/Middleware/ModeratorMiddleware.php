<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ModeratorMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, $next)
    {
        $user = auth('api')->user();

        // শুধুমাত্র সুপারঅ্যাডমিনকে অনুমতি দাও
        if ($user && $user->role === 'superadmin') {
            return $next($request);
        }

        // বাকি সবাই আটকে যাবে
        return response()->json(['message' => 'Access Denied. Only SuperAdmin can perform this action.'], 403);
    }
}
