<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Str;

class ProductService
{
    /**
     * Product list fetch kora (Pagination ebong Category Filter shoho)
     */
    public function getAllProducts($categoryId = null)
    {
        $query = Product::with('category'); // Eager Loading (Performance er jonno)

        if ($categoryId) {
            $query->where('category_id', $categoryId);
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
}
