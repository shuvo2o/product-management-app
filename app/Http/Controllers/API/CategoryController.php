<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Services\CategoryService;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryStoreRequest;
use App\Http\Requests\CategoryUpdateRequest;

class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index()
    {
        try {
            $categories = Category::latest()->get();
            return response()->json(['status' => 'success', 'data' => $categories], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Error fetching categories'], 500);
        }
    }

    public function store(CategoryStoreRequest $request)
    {
        try {
            $category = $this->categoryService->createCategory($request->validated());
            return response()->json(['status' => 'success', 'message' => 'Category Created!', 'data' => $category], 201);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $category = Category::find($id);
        return $category
            ? response()->json(['status' => 'success', 'data' => $category], 200)
            : response()->json(['status' => 'error', 'message' => 'Not Found'], 404);
    }

    public function update(CategoryUpdateRequest $request, $id)
    {
        try {
            $category = $this->categoryService->updateCategory($id, $request->validated());
            return response()->json(['status' => 'success', 'message' => 'Category Updated!', 'data' => $category], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->categoryService->deleteCategory($id);
            return response()->json(['status' => 'success', 'message' => 'Category Deleted!'], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
