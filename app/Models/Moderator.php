<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Moderator
 *
 * @property int $id
 * @property int $userId
 * @property string $fio
 * @property string|null $gender
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\ModeratorFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator query()
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator whereFio($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator whereUserId($value)
 * @mixin \Eloquent
 */
class Moderator extends Model {
    use HasFactory;

    protected $fillable = [
        'userId',
        'fio',
        'gender'
    ];
    protected $hidden = [];


    public static function getAdminsList(array|null $filters = null,
                                         array|null $sort = null,

    ): Builder {
        $query = self::query()->select([
            'moderators.userId                                   as userId',
            'moderators.fio                                  as fio',
        ])
            ->leftJoin('users', 'moderators.userId', '=', 'users.id');


        if (!empty($filters)) {
            $query->whereFilter($filters);
        }

        if (!empty($sort)) {
            $query->orderBy($sort[0]['columnName'], $sort[0]['direction']);
        }

        return $query;
    }

}
