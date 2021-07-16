<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use JsonException;

class UserController extends Controller
{


    public function login(Request $request)
    {
        $login = [
            'username' => $request->get('username'),
            'password' => $request->get('password'),
        ];


        $user = User::find('5000000');

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }


        return response([
            'user' => $user,
//            'accessToken' => $accessToken
        ]);
    }

    public function getAll()
    {
        return User::all();
    }
}
