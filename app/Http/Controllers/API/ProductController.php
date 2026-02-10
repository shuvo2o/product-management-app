<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use App\Services\ProductService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Models\StockHistory; // StockHistory মডেল ইমপোর্ট করা হলো

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
     * Get Dashboard Stats
     */
    public function getStats()
    {
        try {
            $totalProducts = Product::count();
            $outOfStock    = Product::where('stock', '<=', 0)->count();
            $lowStock      = Product::where('stock', '>', 0)->where('stock', '<=', 5)->count();
            $totalValue    = Product::select(DB::raw('SUM(price * stock) as total'))->first()->total;

            $recentProducts = Product::with('category')->latest()->take(5)->get();

            return response()->json([
                'status'  => 'success',
                'data'    => [
                    'stats' => [
                        'total_products' => $totalProducts,
                        'out_of_stock'   => $outOfStock,
                        'low_stock'      => $lowStock,
                        'total_value'    => number_format($totalValue ?? 0, 2, '.', ''),
                    ],
                    'recent_products' => ProductResource::collection($recentProducts)
                ]
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Failed to load dashboard data: ' . $e->getMessage()
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
     * Show single product
     */
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
            // সার্ভিস লেভেলে স্টক হিস্টোরি হ্যান্ডেল করা হবে
            $product = $this->productService->updateProduct($id, $request->validated());

            return response()->json([
                'status'  => 'success',
                'message' => 'Product and Stock Updated Successfully',
                'data'    => new ProductResource($product)
            ], 200);
        } catch (Exception $e) {
            Log::error("Product Update Error [ID: $id]: " . $e->getMessage());
            return response()->json([
                'status'  => 'error',
                'message' => 'Error to update product: ' . $e->getMessage()
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

    /**
     * Get All Stock History for Frontend
     */
    public function getStockHistory()
    {
        try {
            $history = StockHistory::with('product:id,name')
                ->latest()
                ->get();

            return response()->json([
                'status' => 'success',
                'data'   => $history
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to load stock history'
            ], 500);
        }
    }
    public function exportPdf()
    {
        $history = StockHistory::with('product')->latest()->get();

        $pdf = Pdf::loadView('exports.stock_pdf', compact('history'));
        return $pdf->download('inventory_report.pdf');
    }
}
