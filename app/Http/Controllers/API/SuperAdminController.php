<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;

class SuperAdminController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_admins' => User::where('role', 'admin')->count(),
                'total_moderators' => User::where('role', 'moderator')->count(),
                'system_users' => User::count(),
                'total_products' => Product::count(),
            ]
        ]);
    }
}