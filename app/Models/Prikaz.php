<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Prikaz
 *
 * @property int $id
 * @property int $userId
 * @property int $N
 * @property string $name
 * @property string $date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\PrikazFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz query()
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz whereN($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz whereUserId($value)
 * @mixin \Eloquent
 * @property string $title
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz whereTitle($value)
 */
class Prikaz extends Model {
    use HasFactory;

    public const  PRIKAZ_OTCHISLENIE = 'prikaz_ob_otchislenii';
    public const PRIKAZ_ZACHISLENIE = 'prikaz_o_zachislenii';
    public const PRIKAZ_BUDGET = 'prikaz_na_budget';

    protected $fillable = [
        'N',
        'name',
        'title',
        'date',
        'userId',
    ];

    protected $casts = [
        'userId' => 'json',
    ];
}
