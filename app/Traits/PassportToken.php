<?php

namespace App\Traits;

use App\Models\User;
use DateTime;
use DateTimeImmutable;
use Error;
use Exception;
use GuzzleHttp\Psr7\Response;
use Illuminate\Events\Dispatcher;
use Laravel\Passport\Bridge\AccessToken;
use Laravel\Passport\Bridge\AccessTokenRepository;
use Laravel\Passport\Bridge\Client;
use Laravel\Passport\Bridge\RefreshTokenRepository;
use Laravel\Passport\Passport;
use Laravel\Passport\TokenRepository;
use League\OAuth2\Server\CryptKey;
use League\OAuth2\Server\Entities\AccessTokenEntityInterface;
use League\OAuth2\Server\Exception\OAuthServerException;
use League\OAuth2\Server\Exception\UniqueTokenIdentifierConstraintViolationException;
use League\OAuth2\Server\ResponseTypes\BearerTokenResponse;
use Psr\Http\Message\ResponseInterface;
use TypeError;

# https://github.com/laravel/passport/issues/71

/**
 * Trait PassportToken
 *
 * @package App\Traits
 */
trait PassportToken
{
    /**
     * @param User $user
     * @param $clientId
     * @param bool $output default = true
     * @return array | BearerTokenResponse
     * @throws \JsonException
     */
    protected function getBearerTokenByUser(User $user, $clientId, bool $output = true): array|BearerTokenResponse
    {
        $passportToken = $this->createPassportTokenByUser($user, $clientId);
        $bearerToken = $this->sendBearerTokenResponse($passportToken['access_token'], $passportToken['refresh_token']);

        if (!$output) {
            $bearerToken = json_decode($bearerToken->getBody()->__toString(), true, 512, JSON_THROW_ON_ERROR);
        }

        return $bearerToken;
    }

    /**
     * @throws UniqueTokenIdentifierConstraintViolationException
     * @throws OAuthServerException
     */
    protected function createPassportTokenByUser(User $user, $clientId): array
    {
        $accessToken = new AccessToken($user->id, [], 0);
        $accessToken->setIdentifier($this->generateUniqueIdentifier());
        $accessToken->setClient(new Client($clientId, null, null));
        $accessToken->setExpiryDateTime((new DateTimeImmutable())->add(Passport::tokensExpireIn()));

        $accessTokenRepository = new AccessTokenRepository(new TokenRepository(), new Dispatcher());
        $accessTokenRepository->persistNewAccessToken($accessToken);
        $refreshToken = $this->issueRefreshToken($accessToken);

        return [
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
        ];
    }

    /**
     * Generate a new unique identifier.
     *
     * @param int $length
     *
     * @return string
     * @throws OAuthServerException
     *
     */
    private function generateUniqueIdentifier(int $length = 40): string
    {
        try {
            return bin2hex(random_bytes($length));
            // @codeCoverageIgnoreStart
        } catch (TypeError | Error $e) {
            throw OAuthServerException::serverError('An unexpected error has occurred');
        } catch (Exception $e) {
            // If you get this message, the CSPRNG failed hard.
            throw OAuthServerException::serverError('Could not generate a random string');
        }
        // @codeCoverageIgnoreEnd
    }

    /**
     * @throws UniqueTokenIdentifierConstraintViolationException
     * @throws OAuthServerException
     */
    private function issueRefreshToken(AccessTokenEntityInterface $accessToken)
    {
        $maxGenerationAttempts = 10;
        $refreshTokenRepository = app(RefreshTokenRepository::class);

        $refreshToken = $refreshTokenRepository->getNewRefreshToken();
        $refreshToken->setExpiryDateTime((new DateTime())->add(Passport::refreshTokensExpireIn()));
        $refreshToken->setAccessToken($accessToken);

        while ($maxGenerationAttempts-- > 0) {
            $refreshToken->setIdentifier($this->generateUniqueIdentifier());
            try {
                $refreshTokenRepository->persistNewRefreshToken($refreshToken);

                return $refreshToken;
            } catch (UniqueTokenIdentifierConstraintViolationException $e) {
                if ($maxGenerationAttempts === 0) {
                    throw $e;
                }
            }
        }
    }

    protected function sendBearerTokenResponse($accessToken, $refreshToken): ResponseInterface
    {
        $response = new BearerTokenResponse();
        $response->setAccessToken($accessToken);
        $response->setRefreshToken($refreshToken);

        $privateKey = new CryptKey('file://' . Passport::keyPath('oauth-private.key'));

        $response->setPrivateKey($privateKey);
        $response->setEncryptionKey(app('encrypter')->getKey());

        return $response->generateHttpResponse(new Response);
    }
}
