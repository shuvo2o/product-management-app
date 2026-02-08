<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Services\ProductService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
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
            $query = Product::with('category');

            if ($request->has('search')) {
                $query->where('name', 'like', '%' . $request->search . '%');
            }

            $products = $query->latest()->paginate(20);

            return response()->json([
                'status'  => 'success',
                'message' => 'Products retrieved successfully!',
                'data'    => ProductResource::collection($products),
                'meta'    => [
                    'current_page' => $products->currentPage(),
                    'last_page'    => $products->lastPage(),
                    'total'        => $products->total(),
                    'links'        => $products->linkCollection(),
                ]
            ], 200);
        } catch (Exception $e) {
            Log::error("Product Index Error: " . $e->getMessage());
            return response()->json([
                'status'  => 'error',
                'message' => 'Error fetching products'
            ], 500);
        }
    }

    /**
     * Store a newly created product
     */

    public function getStats()
    {
        try {
            // ১. মোট প্রোডাক্ট সংখ্যা
            $totalProducts = Product::count();

            // ২. স্টক শেষ হয়ে গেছে এমন প্রোডাক্ট (Stock = 0)
            $outOfStock = Product::where('stock', '<=', 0)->count();

            // ৩. লো স্টক এলার্ট (স্টক ১ থেকে ৫ এর মধ্যে)
            $lowStock = Product::where('stock', '>', 0)
                ->where('stock', '<=', 5)
                ->count();

            // ৪. মোট ইনভেন্টরি ভ্যালু (Price * Stock এর যোগফল)
            $totalValue = Product::select(DB::raw('SUM(price * stock) as total'))
                ->first()
                ->total;

            return response()->json([
                'status'  => 'success',
                'message' => 'Dashboard statistics retrieved successfully',
                'data'    => [
                    'total_products' => $totalProducts,
                    'out_of_stock'   => $outOfStock,
                    'low_stock'      => $lowStock,
                    'total_value'    => number_format($totalValue ?? 0, 2, '.', ''), // ২ ডেসিমেল পর্যন্ত ডাটা
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Failed to retrieve statistics: ' . $e->getMessage()
            ], 500);
        }
    }
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
    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['status' => 'error', 'message' => 'Not Found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $product
        ], 200);
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
