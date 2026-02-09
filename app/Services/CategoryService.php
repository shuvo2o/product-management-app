<?php

namespace App\Services;
use App\Models\Category;
use Illuminate\Support\Str;

class CategoryService {
    public function createCategory(array $data) {
        $data['slug'] = Str::slug($data['name']);
        return Category::create($data);
    }

    public function updateCategory($id, array $data) {
        $category = Category::findOrFail($id);
        $data['slug'] = Str::slug($data['name']);
        $category->update($data);
        return $category;
    }

    public function deleteCategory($id) {
        $category = Category::findOrFail($id);
        if ($category->products()->count() > 0) {
            throw new \Exception("Category has products attached.");
        }
        return $category->delete();
    }
}