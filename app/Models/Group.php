<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Group
 *
 * @property int $id
 * @property string $name
 * @property int $inProgress
 * @property int $kurs
 * @property string $startDate
 * @property string $finishDate
 * @property int $groupType
 * @property string $facultet
 * @property int $prikazOtchislenieN
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\GroupFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|Group newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Group newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Group query()
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereFacultet($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereFinishDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereGroupType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereInProgress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereKurs($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group wherePrikazOtchislenieN($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereUpdatedAt($value)
 * @mixin \Eloquent
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Group extends Model {
    use HasFactory;

    protected $fillable = [
        'kurs',
        'name',
        'inProgress',
        'startDate',
        'finishDate',
        'groupType',
        'facultet',
    ];

    //    дефолт запрос на данные студента
    public static function getList(array|null $filters = null, array|null $sort = null): Builder {
        $query = self::query()->select([
            'id         as id',
            'name       as groupName',
            'kurs       as kurs',
            'inProgress as inProgress',
            'groupType  as groupType',
            'facultet   as facultet',
            'startDate  as startDate',
            'finishDate as finishDate',
        ]);


        if (!empty($filters)) {
            $query->whereFilter($filters);
        }

        if (!empty($sort)) {
            $query->orderBy($sort[0]['columnName'], $sort[0]['direction']);
        }

        return $query;
    }

    //обработка фильтров при поиске
    protected function scopeWhereFilter(Builder $query, array $filters): Builder {
        if (empty($filters)) {
            return $query;
        }

        foreach ($filters as $filter) {
            $key = $filter['columnName'];
            $value = $filter['value'];

            // Пустые значения пропускаем
            if (empty($filter['value'])) {
                continue;
            }

            if ($key === 'groupName') {
                $query->where('name', $value);
            } elseif ($key === 'groupType') {
                if (str_contains('очная', strtolower($value))) {
                    $query->where('groupType', 0);
                } elseif (str_contains('заочная', strtolower($value))) {
                    $query->where('groupType', 1);
                } else {
                    $query->where('groupType', -999);
                }
            } elseif ($key === 'inProgress') {
                if (str_contains('учится', strtolower($value))) {
                    $query->where('inProgress', 1);
                } elseif (str_contains('выпущена', strtolower($value))) {
                    $query->where('inProgress', 0);
                } else {
                    $query->where('inProgress', -999);
                }
            } else {
                $query->where($key, 'like', "%$value%");
            }

        }

        return $query;
    }
}
