<?php

namespace App\Http\Controllers\API\User; 

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;

class UserController extends Controller
{

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
                'message' => 'User not found or update failed'
            ], 404);
        }
    }

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