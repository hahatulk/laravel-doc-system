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

    /**
     * @throws JsonException
     * @throws \Exception
     */
    public function userRefreshToken(Request $request): JsonResponse
    {
        $client = DB::table('oauth_clients')
            ->where('password_client', true)
            ->first();

        $data = [
            'grant_type' => 'refresh_token',
            'refresh_token' => $request->refresh_token,
            'client_id' => $client->id,
            'client_secret' => $client->secret,
            'scope' => ''
        ];
        $request = Request::create('/oauth/token', 'POST', $data);
        $content = json_decode(app()->handle($request)->getContent(), true, 512, JSON_THROW_ON_ERROR);

        return response()->json([
            'error' => false,
            'data' => [
                'meta' => [
                    'token' => $content->access_token,
                    'refresh_token' => $content->refresh_token,
                    'type' => 'Bearer'
                ]
            ]
        ], Response::HTTP_OK);
    }

    /**
     * @throws JsonException
     */
    public function login(Request $request)
    {
//        $login = [
//            'username' => $request->get('username'),
//            'password' => $request->get('password'),
//        ];

        $user = User::findCredentials($request->get('username'), $request->get('password'));

        if (!$user) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 400);
        }

        $tokens = $this->userGetToken($user->username, $user->password);

        return response($tokens);
    }

    /**
     * @throws JsonException
     * @throws \Exception
     */
    public function userGetToken(string $username, string $password)
    {
        $client = DB::table('oauth_clients')
            ->where('password_client', true)
            ->first();

        $data = [
            'grant_type' => 'password',
            'client_id' => $client->id,
            'client_secret' => $client->secret,
            'username' => $username,
            'password' => $password,
            'scope' => ''
        ];

        $response = Request::create('/oauth/token', 'POST', $data);
        return json_decode(app()->handle($response)->getContent(), true, 512, JSON_THROW_ON_ERROR);
    }

    public function getAll()
    {
        return User::all();
    }
}
