<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Facultet
 *
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\FacultetFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|Facultet newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Facultet newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Facultet query()
 * @method static \Illuminate\Database\Eloquent\Builder|Facultet whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facultet whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facultet whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facultet whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Facultet extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];
}
