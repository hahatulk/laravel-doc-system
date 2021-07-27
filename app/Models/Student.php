<?php

namespace App\Models;

use Auth;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
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
 * @property int|null $diplomaId
 * @method static \Database\Factories\StudentFactory factory(...$parameters)
 * @method static Builder|Student newModelQuery()
 * @method static Builder|Student newQuery()
 * @method static Builder|Student query()
 * @method static Builder|Student whereBirthday($value)
 * @method static Builder|Student whereCreatedAt($value)
 * @method static Builder|Student whereDiplomaId($value)
 * @method static Builder|Student whereFormaObuch($value)
 * @method static Builder|Student whereGender($value)
 * @method static Builder|Student whereGroup($value)
 * @method static Builder|Student whereId($value)
 * @method static Builder|Student whereName($value)
 * @method static Builder|Student wherePatronymic($value)
 * @method static Builder|Student whereStatus($value)
 * @method static Builder|Student whereSurname($value)
 * @method static Builder|Student whereUpdatedAt($value)
 * @method static Builder|Student whereUserId($value)
 * @method static Builder|Student whereZachislenPoPrikazu($value)
 * @mixin \Eloquent
 * @method static Builder|Student whereFilter(array $filters)
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

    protected $hidden = [
        'userId',
        'zachislenPoPrikazu',
    ];

    public static function findOneByUserId(int $userId): Collection {

        return DB::table('students')
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
            ->where('users.id', '=', $userId)
            ->get();
    }

    public static function findSelf(): Collection {
        $user = Auth::user();

        if ($user->role === User::ROLE_STUDENT) {
            $q = self::getInfo()
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
    }

//    дефолт запрос на данные студента
    public static function getInfo(array|null $filters, array|null $sort) {
        $query = self::select([
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
                DB::raw("DATE_FORMAT(prikazs.date, \"%Y-%m-%d\")   as prikazDate"),
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
            ->join('groups as g', 'students.group', '=', 'g.id');

        if (!empty($filters)) {
            $query->whereFilter($filters);
        }

        if (!empty($sort)) {
            $query->orderBy($sort['columnName'], $sort['direction']);
        }

        return $query;
    }

    public function scopeWhereFilter(Builder $query, array $filters): Builder {
        if (empty($filters)) {
            return $query;
        }

        foreach ($filters as $key => $value) {
            // Пустые значения пропускаем
            if (empty($value)) {
                continue;
            }

            // Если поиск по мастеру, обращаемся через связь
            if ($key === 'gender') {
                if (str_contains('женский', $value)) {
                    $query->where('students.gender', 'женский');
                } elseif (str_contains('мужской', $value)) {
                    $query->where('students.gender', 'мужской');
                }
            } // Если поиск по ID, то используем точное соответствие


//            elseif ($key === 'id') {
//                $query->where('tasks.id', $value);
//            } // Если поиск по ID, то используем точное соответствие
//            else {
//                $query->where('tasks.' . $key, 'ilike', '%' . $value . '%');
//            }
        }

        return $query;
    }

}
