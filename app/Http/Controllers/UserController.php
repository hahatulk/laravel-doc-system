<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use JsonException;

class UserController extends Controller
{

    /**
     * @throws JsonException
     * @throws Exception
     */
    public function userRefreshToken(Request $request): Application|ResponseFactory|Response
    {
        $client = DB::table('oauth_clients')
            ->where('password_client', true)
            ->first();

        $data = [
            'grant_type' => 'refresh_token',
            'refresh_token' => $request->cookie('refresh_token'),
            'client_id' => $client->id,
            'client_secret' => $client->secret,
            'scope' => ''
        ];
        $response = Request::create('/oauth/token', 'POST', $data);
        $content = json_decode(app()->handle($response)->getContent(), true, 512, JSON_THROW_ON_ERROR);

        return response($content);
    }

    /**
     * @throws JsonException
     */
    public function login(Request $request): Response|JsonResponse|Application|ResponseFactory
    {
        $vars = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $user = User::findCredentials($vars['username'], $vars['password']);

        if (!$user) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 400);
        }

//        return response(dd($vars));
        return response($this->userGetToken($user->username, $user->password));
    }

    /**
     * @throws JsonException
     * @throws Exception
     */
    private function userGetToken(string $username, string $password)
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
