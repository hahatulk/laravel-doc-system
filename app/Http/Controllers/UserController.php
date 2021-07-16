<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    //

    public function login(Request $request)
    {
        $login = [
            'username' => $request->get('username'),
            'password' => $request->get('password'),
        ];



        if (!Auth::attempt($login)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $user = Auth::user();
        $accessToken = $user->createToken('authToken')->accessToken;

        return response([
            'user' => $user,
            'accessToken' => $accessToken
        ]);
    }

    public function getAll(){
        return User::all();
    }
}
