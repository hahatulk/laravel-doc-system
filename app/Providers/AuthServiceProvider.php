<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Passport\Passport;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        Passport::routes();

        Passport::tokensCan([
            User::ROLE_ADMIN => 'admin-access',
            User::ROLE_STUDENT => 'student-access',
        ]);

        $accessExpire = (int)env('ACCESS_TOKEN_HOURS');
        $refreshExpire = (int)env('REFRESH_TOKEN_DAYS');

        Passport::tokensExpireIn(now()->addHours($accessExpire));
        Passport::refreshTokensExpireIn(now()->addDays($refreshExpire));
        Passport::personalAccessTokensExpireIn(now()->addMonths(6));
    }
}
