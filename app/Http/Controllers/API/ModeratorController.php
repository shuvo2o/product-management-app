<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;

class ModeratorController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'pending_products' => Product::where('status', 'pending')->count(),
                'recent_updates' => Product::orderBy('updated_at', 'desc')->take(5)->get(),
                'out_of_stock' => Product::where('stock', 0)->count(),
            ]
        ]);
    }
}