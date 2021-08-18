<?php

namespace App\Models;

use Barryvdh\LaravelIdeHelper\Eloquent;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\DatabaseNotificationCollection;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Laravel\Passport\Client;
use Laravel\Passport\HasApiTokens;
use Laravel\Passport\Token;

/**
 * App\Models\User
 *
 * @property int $id
 * @property string $username
 * @property string $password
 * @property string $role
 * @property int $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection|Client[] $clients
 * @property-read int|null $clients_count
 * @property-read DatabaseNotificationCollection|DatabaseNotification[] $notifications
 * @property-read int|null $notifications_count
 * @property-read Collection|Token[] $tokens
 * @property-read int|null $tokens_count
 * @method static UserFactory factory(...$parameters)
 * @method static Builder|User newModelQuery()
 * @method static Builder|User newQuery()
 * @method static Builder|User query()
 * @method static Builder|User whereCreatedAt($value)
 * @method static Builder|User whereId($value)
 * @method static Builder|User wherePassword($value)
 * @method static Builder|User whereRole($value)
 * @method static Builder|User whereStatus($value)
 * @method static Builder|User whereUpdatedAt($value)
 * @method static Builder|User whereUsername($value)
 * @mixin Eloquent
 */
class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable;
    use \Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

    public const ROLE_ADMIN = 'admin';
    public const ROLE_STUDENT = 'student';
    public function prikazs() {
        return $this->belongsToJson(Prikaz::class, 'userId[]->id');
    }
    protected $fillable = [
        'username',
        'password',
        'role',
        'status'
    ];

    protected $hidden = [
        'password',
    ];
//    protected $casts = [
//        'email_verified_at' => 'datetime',
//    ];

    public static function findByUsername(string $username): Model|Builder|null {
        return self::whereUsername($username)->first();
    }

    public static function verifyCredentials(string $username, string $password): Model|Builder|null {
        return self::whereUsername($username)->wherePassword($password)->first();
    }

    public static function editCredentials(string $username, string $password): Model|Builder|null {
        return self::whereUsername($username)->wherePassword($password)->first();
    }

    /**
     * Find the user instance for the given username.
     *
     * @param string $username
     * @return \App\Models\User
     */
    public function findForPassport($username) {
        return $this->where('username', $username)->first();
    }

    /**
     * Validate the password of the user for the Passport password grant.
     *
     * @param string $password
     * @return bool
     */
    public function validateForPassportPasswordGrant($password): bool {
        return true;
    }

    public function hasRole(array $roles): bool
    {
        return in_array($this->role, $roles, true);
    }
}
