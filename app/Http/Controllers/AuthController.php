<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use JsonException;
use Laravel\Passport\TokenRepository;
use Laravel\Passport\RefreshTokenRepository;

class AuthController extends Controller
{

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

        $tokens = $this->issueToken($user->username, $user->password);

        Cookie::queue('access_token', $tokens['access_token'], env('ACCESS_TOKEN_MINUTES'));
        Cookie::queue('refresh_token', $tokens['refresh_token'], env('REFRESH_TOKEN_MINUTES'));

        return response()->json([
            'msg' => 'Logged in.'
        ]);
    }

    /**
     * @throws JsonException
     * @throws Exception
     */
    public function refreshToken(Request $request): Application|ResponseFactory|Response
    {
        $client = DB::table('oauth_clients')
            ->where('password_client', true)
            ->first();

        $data = [
            'grant_type' => 'refresh_token',
            'refresh_token' => $request->cookie('refresh_token'),
            'client_id' => $client->id,
            'client_secret' => $client->secret,
            'scope' => Auth::user()->role
        ];
        $response = Request::create('/oauth/token', 'POST', $data);
        $tokens = json_decode(app()->handle($response)->getContent(), true, 512, JSON_THROW_ON_ERROR);

        $accessExpire = (int)env('ACCESS_TOKEN_HOURS');
        $refreshExpire = (int)env('REFRESH_TOKEN_DAYS');

        Cookie::queue('access_token', $tokens['access_token'], $accessExpire);
        Cookie::queue('refresh_token', $tokens['refresh_token'], $refreshExpire);

        return response($tokens);
    }

    public function logout(Request $request): bool
    {
        $userTokens = Auth::user()->tokens;
        $tokenId = $request->user()->token()->id;

        $tokenRepository = app(TokenRepository::class);
        $refreshTokenRepository = app(RefreshTokenRepository::class);

        // Revoke an access token...
        $tokenRepository->revokeAccessToken($tokenId);

        // Revoke all of the token's refresh tokens...
        $refreshTokenRepository->revokeRefreshTokensByAccessTokenId($tokenId);

        Cookie::queue('access_token', '', 0);
        Cookie::queue('refresh_token', '', 0);

        return true;
    }

    public function revokeAllTokens(Request $request): bool
    {
        $userTokens = Auth::user()->tokens;
        $tokenId = $request->user()->token()->id;

        $tokenRepository = app(TokenRepository::class);
        $refreshTokenRepository = app(RefreshTokenRepository::class);

        foreach($userTokens as $token) {
            $token->revoke();
        }

        // Revoke all of the token's refresh tokens...
        $refreshTokenRepository->revokeRefreshTokensByAccessTokenId($tokenId);

        return true;
    }

    /**
     * @throws JsonException
     * @throws Exception
     */
    private function issueToken(string $username, string $password): mixed
    {
        $client = DB::table('oauth_clients')
            ->where('password_client', true)
            ->first();

        $user = User::find($username);

        $data = [
            'grant_type' => 'password',
            'client_id' => $client->id,
            'client_secret' => $client->secret,
            'username' => $username,
            'password' => $password,
            'scope' => $user->role
        ];


        $response = Request::create('/oauth/token', 'POST', $data);
        return json_decode(app()->handle($response)->getContent(), true, 512, JSON_THROW_ON_ERROR);
    }

    public function tokenCheck(): JsonResponse {
       return $this->success();
    }
}
