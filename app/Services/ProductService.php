<?php

namespace App\Services;

use Exception;
use App\Models\Product;
use App\Models\StockHistory; // নতুন মডেলটি ইমপোর্ট করুন
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function getAllProducts($request)
    {
        $query = Product::query()->with('category');
        if ($request->has('search') && $request->search != null) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('category_id') && $request->category_id != null) {
            $query->where('category_id', $request->category_id);
        }
        return $query->latest()->paginate(10);
    }

    public function createProduct(array $data)
    {
        $data['slug'] = Str::slug($data['name']);
        $data['sku']  = 'PRD-' . strtoupper(Str::random(8));

        // Image upload logic
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            $data['image'] = $data['image']->store('products', 'public');
        }

        return Product::create($data);
    }

    public function updateProduct($id, array $data)
    {
        DB::beginTransaction();
        try {
            $product = Product::findOrFail($id);
            
            // পরিবর্তনের আগের স্টক সেভ করে রাখা
            $oldStock = $product->stock;
            
            $updateData = collect($data)->except(['_method'])->toArray();

            if (isset($updateData['name'])) {
                $updateData['slug'] = Str::slug($updateData['name']);
            }

            // Image Update Logic
            if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }
                $updateData['image'] = $data['image']->store('products', 'public');
            } else {
                unset($updateData['image']);
            }

            // ১. প্রোডাক্ট আপডেট করুন
            $product->update($updateData);

            // ২. স্টক হিস্টোরি রেকর্ড করার লজিক (নতুন সংযোজন)
            $newStock = isset($updateData['stock']) ? (int)$updateData['stock'] : $oldStock;

            if ($oldStock != $newStock) {
                $diff = $newStock - $oldStock;

                StockHistory::create([
                    'product_id' => $product->id,
                    'type'       => $diff > 0 ? 'in' : 'out',
                    'quantity'   => abs($diff),
                    'old_stock'  => $oldStock,
                    'new_stock'  => $newStock,
                    'note'       => $data['note'] ?? 'Stock updated manually',
                ]);
            }

            DB::commit();
            return $product;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Product Update Failed: " . $e->getMessage());
            throw new Exception("Error Updating Product: " . $e->getMessage());
        }
    }

    public function deleteProduct($id)
    {
        DB::beginTransaction();

        try {
            $product = Product::findOrFail($id);
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $product->delete();

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Product Delete Failed: " . $e->getMessage());

            throw new \Exception("Failed to Delete Product");
        }
    }
}