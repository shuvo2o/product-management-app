<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Services\ProductService;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(Request $request)
    {
        $products = $this->productService->getAllProducts($request->category_id);

        return response()->json([
            'status' => 'success',
            'data'   => $products
        ]);
    }
}
