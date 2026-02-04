<?php

namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use App\Services\ProductService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\ProductResource;
use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Get all products with optional filters
     */
    public function index(Request $request)
    {
        try {
            $products = $this->productService->getAllProducts($request);

            return response()->json([
                'status' => 'success',
                'data'   => ProductResource::collection($products)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error to show product list'
            ], 500);
        }
    }

    /**
     * Store a newly created product
     */
    public function store(ProductStoreRequest $request)
    {
        try {
            $product = $this->productService->createProduct($request->validated());

            return response()->json([
                'status'  => 'success',
                'message' => 'Product created successfully!',
                'data'    => new ProductResource($product)
            ], 201);
        } catch (Exception $e) {
            Log::error("Product Store Error: " . $e->getMessage());
            return response()->json([
                'status'  => 'error',
                'message' => 'Error to store product'
            ], 500);
        }
    }

    /**
     * Update an existing product
     */
    public function update(ProductUpdateRequest $request, $id)
    {
        try {
            $product = $this->productService->updateProduct($id, $request->validated());

            return response()->json([
                'status'  => 'success',
                'message' => 'Product Updated Successfully',
                'data'    => new ProductResource($product)
            ], 200);
        } catch (Exception $e) {
            Log::error("Product Update Error [ID: $id]: " . $e->getMessage());
            return response()->json([
                'status'  => 'error',
                'message' => 'Error to store product'
            ], 500);
        }
    }

    /**
     * Delete a product
     */
    public function delete($id)
    {
        try {
            $this->productService->deleteProduct($id);

            return response()->json([
                'status'  => 'success',
                'message' => 'Product Deleted Successfully.'
            ], 200);
        } catch (Exception $e) {
            Log::error("Product Delete Error [ID: $id]: " . $e->getMessage());
            return response()->json([
                'status'  => 'error',
                'message' => 'Error to Delete product'
            ], 500);
        }
    }
}
