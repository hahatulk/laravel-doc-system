<?php

namespace App\Models;

use Database\Factories\StudentFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
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
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int|null $diplomaId
 * @method static StudentFactory factory(...$parameters)
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
 * @mixin Eloquent
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
//        'userId',
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

    public static function findSelf() {
        $user = Auth::user();

        if ($user->role === User::ROLE_STUDENT) {
            $q = self::getList()
                ->where('users.username', '=', $user->username)
                ->first();
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
                ->first();
        }

        return $q;
    }

//    дефолт запрос на данные студента
    public static function getList(array|null $filters = null, array|null $sort = null): Builder {
        $query = self::query()->select([
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
            ->leftJoin('users', 'students.userId', '=', 'users.id')
            ->leftJoin('prikazs', 'students.zachislenPoPrikazu', '=', 'prikazs.N')
            ->leftJoin('groups as g', 'students.group', '=', 'g.id');


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

        foreach ($filters as $filter) {
            $key = $filter['columnName'];
            $value = $filter['value'];

            // Пустые значения пропускаем
            if (empty($filter['value'])) {
                continue;
            }

            if ($key === 'gender') {
                if (str_contains('женский', strtolower($value))) {
                    $query->where('students.gender', 'женский');

                } elseif (str_contains('мужской', strtolower($value))) {
                    $query->where('students.gender', 'мужской');

                } else {
                    $query->where('students.gender', 'гендерофлюид');
                }

            } elseif ($key === 'groupName') {
                $query->where('g.name', $value);

            } elseif ($key === 'surname') {
                $string = ucfirst($value);
                $query->where('students.surname', 'like', "%$string%");

            } elseif ($key === 'name') {
                $string = ucfirst($value);
                $query->where('students.name', 'like', "%$string%");

            } elseif ($key === 'patronymic') {
                $string = ucfirst($value);
                $query->where('students.patronymic', 'like', "%$string%");

            } else {
                $query->where($key, 'like', "%$value%");
            }

//            dd($key);
        }

        return $query;
    }

}
