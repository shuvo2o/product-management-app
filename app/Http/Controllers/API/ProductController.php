<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Services\ProductService;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;

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

    public function update(ProductUpdateRequest $request, $id, ProductService $productService)
    {
        try {
            $product = $productService->updateProduct($id, $request->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Product Update SuccessFully',
                'data' => $product
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function delete($id, ProductService $productService)
    {
        try {
            $productService->deleteProduct($id);
            return response()->json([
                'status' => 'success',
                'message' => 'Product Deleted Successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
