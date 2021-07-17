<?php

namespace App\Models;

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
 */
class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'kurs',
        'name',
        'startDate',
        'finishDate',
        'groupType',
        'facultet',
    ];
}
