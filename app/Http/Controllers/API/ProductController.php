<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Services\ProductService;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProductStoreRequest;

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


    public function store(ProductStoreRequest $request)
    {
        $product = $this->productService->createProduct($request->validated());

        return response()->json([
            'status'  => 'success',
            'message' => 'Product created successfully!',
            'data'    => $product
        ], 201);
    }
}
