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

    /**
     * Notun Product create kora (Business Logic ekhane thakbe)
     */
    public function createProduct(array $data)
    {
        $data['slug'] = Str::slug($data['name']);
        
        // Jdi SKU na thake, auto generate hobe
        if (!isset($data['sku'])) {
            $data['sku'] = 'PRD-' . strtoupper(Str::random(8));
        }

        return Product::create($data);
    }
}