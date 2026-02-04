<?php

namespace App\Services;

use Exception;
use App\Models\Product;
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
            if (isset($data['name'])) {
                $data['slug'] = Str::slug($data['name']);
            }
            if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }
                $data['image'] = $data['image']->store('products', 'public');
            }
            $product->update($data);
            DB::commit();
            return $product;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Product Update Failed: " . $e->getMessage());
            throw new Exception("Error Updating Product");
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
