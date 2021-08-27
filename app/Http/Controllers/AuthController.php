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
use Laravel\Passport\RefreshTokenRepository;
use Laravel\Passport\TokenRepository;

class AuthController extends Controller {
    /**
     * @throws JsonException
     */
    public function login(Request $request): Response|JsonResponse|Application|ResponseFactory {
        $vars = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $user = User::verifyCredentials($vars['username'], $vars['password']);

        if (!$user) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 400);
        }

        $tokens = $this->issueToken($user->username, $user->password);
        $accessTokenExpireMinutes = User::ACCESS_TOKEN_HOURS * 60;
        $refreshTokenExpireMinutes = User::REFRESH_TOKEN_DAYS * 24 * 60;

        Cookie::queue('access_token', $tokens['access_token'], $accessTokenExpireMinutes);
        Cookie::queue('refresh_token', $tokens['refresh_token'], $refreshTokenExpireMinutes);

        return response()->json([
            'msg' => 'Logged in.'
        ]);
    }

    /**
     * @throws JsonException
     * @throws Exception
     */
    private function issueToken(string $username, string $password): mixed {
        $client = DB::table('oauth_clients')
            ->where('password_client', true)
            ->first();

        $user = User::findByUsername($username);

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

    /**
     * @throws JsonException
     * @throws Exception
     */
    public function refreshToken(Request $request): JsonResponse {
        $client = DB::table('oauth_clients')
            ->where('password_client', true)
            ->first();

        $data = [
            'grant_type' => 'refresh_token',
            'refresh_token' => $request->cookie('refresh_token'),
            'client_id' => $client->id,
            'client_secret' => $client->secret,
        ];
        $response = Request::create('/oauth/token', 'POST', $data);
        $tokens = json_decode(app()->handle($response)->getContent(), true, 512, JSON_THROW_ON_ERROR);

        $accessTokenExpireMinutes = User::ACCESS_TOKEN_HOURS * 60;
        $refreshTokenExpireMinutes = User::REFRESH_TOKEN_DAYS * 24 * 60;

        try {
            Cookie::queue('access_token', $tokens['access_token'], $accessTokenExpireMinutes);
            Cookie::queue('refresh_token', $tokens['refresh_token'], $refreshTokenExpireMinutes);
        } catch (\Exception $e) {
            return $this->error('Refresh token failure');
        }

        return $this->success();
    }

    public function logout(Request $request): JsonResponse {
        $tokenId = $request->user()->token()->id;

        $tokenRepository = app(TokenRepository::class);
        $refreshTokenRepository = app(RefreshTokenRepository::class);

        // Revoke an access token...
        $tokenRepository->revokeAccessToken($tokenId);
        // Revoke all of the token's refresh tokens...
        $refreshTokenRepository->revokeRefreshTokensByAccessTokenId($tokenId);

        Cookie::queue('access_token', '', 0);
        Cookie::queue('refresh_token', '', 0);

        return $this->success();
    }

    public function revokeAllTokens(Request $request): JsonResponse {
        $userTokens = Auth::user()->tokens;
        $tokenId = $request->user()->token()->id;

//        $tokenRepository = app(TokenRepository::class);
        $refreshTokenRepository = app(RefreshTokenRepository::class);

        //revoke all access tokens
        foreach ($userTokens as $token) {
            $token->revoke();
        }

        // Revoke all of the token's refresh tokens...
        $refreshTokenRepository->revokeRefreshTokensByAccessTokenId($tokenId);

        return $this->success();
    }

    public function tokenCheck(): JsonResponse {
        return $this->success();
    }
}
