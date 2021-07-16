<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $login = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($login)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $user = User::where('username', $login['username'])
            ->first();

        if (!$user) {
            return response([
                'message' => $login,
            ]);
        }

        $accessToken = $user->createToken('authToken')->accessToken;

        return response([
            'user' => $user,
            'accessToken' => $accessToken
        ]);
    }
}
