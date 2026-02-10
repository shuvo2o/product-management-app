<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Exception;

class UserController extends Controller
{
    // পেন্ডিং ইউজারদের লিস্ট (is_approved = 0)
    public function pendingUsers(): JsonResponse
    {
        try {
            $users = User::where('is_approved', 0)->latest()->get();
            return response()->json([
                'status' => 'success',
                'data' => $users 
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch users'
            ], 500);
        }
    }

    // ইউজার অ্যাপ্রুভ করা
    public function approveUser($id): JsonResponse
    {
        try {
            $user = User::findOrFail($id); 
            $user->is_approved = 1;
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'User approved successfully!'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'User update failed'
            ], 404);
        }
    }

    // ইউজার ডিলিট করা
    public function destroy($id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'User deleted successfully!'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'User could not be deleted'
            ], 404);
        }
    }
}