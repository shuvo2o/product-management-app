<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_approved' => false, // ডিফল্টভাবে আন-অ্যাপ্রুভড থাকবে
        ]);

        // নতুন ইউজারকে ডিফল্ট 'user' রোল দেওয়া
        $user->assignRole('user');

        return response()->json([
            'message' => 'Registration successful. Please wait for admin approval.',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $user =User::where('email', $request->email)->first();
        if ($user && \Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {

            if (!$user->is_approved) {
                return response()->json(['message' => 'Your account is pending approval.'], 403);
            }

            /** @var \App\Models\User $user */
            $token = $user->createToken('authToken')->accessToken;

            return response()->json([
                'token' => $token,
                'user' => $user,
                'role' => $user->getRoleNames()
            ], 200);
        }

        return response()->json(['message' => 'Invalid Email or Password!'], 401);
    }
    public function logout(Request $request)
    {
        
        $request->user()->token()->revoke();
        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out'
        ], 200);
    }
}
