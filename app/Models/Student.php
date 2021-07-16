<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Student
 *
 * @property int $id
 * @property int $userId
 * @property string $surname
 * @property string $name
 * @property string|null $patronymic
 * @property string $gender
 * @property string $birthday
 * @property int $group
 * @property int $zachislenPoPrikazu
 * @property int $formaObuch
 * @property int $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\StudentFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|Student newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Student newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Student query()
 * @method static \Illuminate\Database\Eloquent\Builder|Student whereBirthday($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Student whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Student whereFormaObuch($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Student whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Student whereGroup($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Student whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Student whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Student wherePatronymic($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Student whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Student whereSurname($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Student whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Student whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Student whereZachislenPoPrikazu($value)
 * @mixin \Eloquent
 */
class Student extends Model
{
    use HasFactory;
}
