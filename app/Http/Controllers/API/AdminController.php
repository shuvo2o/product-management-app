<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class AdminController extends Controller
{
public function index()
{
    return response()->json([
        'status' => 'success', 
        'data' => [
            'stats' => [
                'total_products' => Product::count(),
                'out_of_stock'   => Product::where('stock', 0)->count(),
                'low_stock'      => Product::where('stock', '<', 10)->count(),
                'total_value'    => Product::sum(DB::raw('price * stock')), 
            ],
            'recent_products' => Product::latest()->take(5)->get() 
        ]
    ]);
}
}