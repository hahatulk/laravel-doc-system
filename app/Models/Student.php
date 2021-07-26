<?php

namespace App\Models;

use App\Http\Requests\UserInfoGetRequest;
use Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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
class Student extends Model {
    use HasFactory;

    protected $fillable = [
        'userId',
        'surname',
        'name',
        'patronymic',
        'gender',
        'birthday',
        'group',
        'zachislenPoPrikazu',
        'formaObuch',
        'status',
    ];


    public static function findAllInfo(UserInfoGetRequest $request): \Illuminate\Support\Collection {
        $user = Auth::user();

        if ($user->role === User::ROLE_STUDENT) {
            $q = DB::table('students')
                ->select([
                    'students.id                                       as id',
                    'students.userId                                   as userId',
                    'students.surname                                  as surname',
                    'students.name                                     as name',
                    'students.patronymic                               as patronymic',
                    'students.gender                                   as gender',
                    'students.diplomaId                                as diplomaId',
                    DB::raw("DATE_FORMAT(students.birthday, \"%Y-%m-%d\")      as birthday"),
                    DB::raw("TIMESTAMPDIFF(YEAR, students.birthday, CURDATE()) as age"),
                    'students.formaObuch                               as formaObuch',
                    'prikazs.N                                         as prikaz',
                    DB::raw('DATE_FORMAT(prikazs.date, "%Y-%m-%d")     as prikazDate'),
                    'g.id                                              as group',
                    'g.name                                            as groupName',
                    'g.groupType                                       as groupType',
                    'g.kurs                                            as kurs',
                    'g.startDate                                       as startDate',
                    'g.finishDate                                      as finishDate',
                    'users.role                                        as role',
                ])
                ->join('users', 'students.userId', '=', 'users.id')
                ->join('prikazs', 'students.zachislenPoPrikazu', '=', 'prikazs.N')
                ->join('groups as g', 'students.group', '=', 'g.id')
                ->where('users.username', '=', $user->username)
                ->get();
        }

        if ($user->role === User::ROLE_ADMIN) {
            $q = DB::table('users')
                ->select([
                    'users.id                                          as id',
                    'users.role                                        as role',
                    'moderators.gender                                 as gender',
                    'moderators.fio                                    as fio',
                ])
                ->join('moderators', 'moderators.userId', '=', 'users.id')
                ->where('users.username', '=', $user->username)
                ->get();
        }

        return $q;
//            $userId =
//        return self::find($userId)
//            ->join();
    }
}
