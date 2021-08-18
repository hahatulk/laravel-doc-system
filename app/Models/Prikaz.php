<?php

namespace App\Models;

use App\Class\StudentImportExcelReadFilter;
use Database\Factories\PrikazFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Exception;

/**
 * App\Models\Prikaz
 *
 * @property int $id
 * @property int $userId
 * @property int $N
 * @property string $name
 * @property string $date
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static PrikazFactory factory(...$parameters)
 * @method static Builder|Prikaz newModelQuery()
 * @method static Builder|Prikaz newQuery()
 * @method static Builder|Prikaz query()
 * @method static Builder|Prikaz whereCreatedAt($value)
 * @method static Builder|Prikaz whereDate($value)
 * @method static Builder|Prikaz whereId($value)
 * @method static Builder|Prikaz whereN($value)
 * @method static Builder|Prikaz whereName($value)
 * @method static Builder|Prikaz whereUpdatedAt($value)
 * @method static Builder|Prikaz whereUserId($value)
 * @mixin Eloquent
 * @property string $title
 * @method static Builder|Prikaz whereTitle($value)
 * @property-read \App\Models\DefaultDocument $default_document
 * @method static Builder|Prikaz whereFilter(array $filters)
 */
class Prikaz extends Model {
    use HasFactory;
//    use \Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

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
    protected $hidden = [
        'userId',
        'zachislenPoPrikazu',
    ];
    protected $casts = [
        'userId' => 'json',
    ];

    public static function getList(array|null $filters = null, array|null $sort = null): Builder {
        $query = self::select([
            'prikazs.id               as id',
            'default_documents.title as title',
            'prikazs.name             as name',
            'prikazs.N                as N',
            'prikazs.date             as prikazDate'
        ])
            ->leftJoin('default_documents', 'prikazs.name', '=', 'default_documents.name');

        if (!empty($filters)) {
            $query->whereFilter($filters);
        }

        if (!empty($sort)) {
            $query->orderBy($sort[0]['columnName'], $sort[0]['direction']);
        }

        return $query;
    }

    public static function createPrikaz(int $N,
                                        string $name,
                                        string $title,
                                        string $date,
                                        array $userIds
    ) {
        $prikazCount = self::where('N', '=', $N)->count();

        if ($prikazCount === 0 && $name === self::PRIKAZ_ZACHISLENIE) {
            return self::create([
                'N' => $N,
                'name' => $name,
                'title' => $title,
                'date' => $date,
                'userId' => $userIds,
            ]);
        }

        if ($prikazCount === 0) {
            return self::create([
                'N' => $N,
                'name' => $name,
                'title' => $title,
                'date' => $date,
                'userId' => ($userIds),
            ]);
        }

        return false;
    }

    /**
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     * @throws Exception
     */
    public static function exctractStudents($file): array {
        $fileName = $file->getClientOriginalName();
        $fileExt = pathinfo($fileName, PATHINFO_EXTENSION);

        $filterSubset = new StudentImportExcelReadFilter();

        $reader = IOFactory::createReader(ucfirst($fileExt));
        $reader->setReadFilter($filterSubset);
        $reader->setReadDataOnly(true);
        $spreadsheet = $reader->load($file);
        $worksheet = $spreadsheet->getActiveSheet();

        $highestRow = $worksheet->getHighestDataRow(); // e.g. 10
        $highestColumn = Coordinate::columnIndexFromString($worksheet->getHighestDataColumn()); // e.g. 5

        $columns = [
            'surname',
            'name',
            'patronymic',
            'gender',
            'birthday',
//            'group',
//            'zachislenPoPrikazu',
            'formaObuch',
//            'status',
        ];
        $students = [];

        //проход по строкам
        for ($row = 2; $row <= $highestRow; $row++) {
            $student = [];

            //проход по столбам
            for ($col = 1; $col <= $highestColumn; $col++) {
                $value = $worksheet->getCellByColumnAndRow($col, $row)->getValue();
                $student[$columns[$col - 1]] = trim($value);
            }

            $students[] = $student;
        }

        return $students;
    }

    //обработка фильтров при поиске
    public function scopeWhereFilter(Builder $query, array $filters): Builder {
        if (empty($filters)) {
            return $query;
        }

        foreach ($filters as $filter) {
            $key = $filter['columnName'];
            $value = $filter['value'];

            if ($key === 'title') {
                $query->where('prikazs.title', 'like', "%$value%");
            } elseif ($key === 'id') {
                $query->where('prikazs.id', 'like', "%$value%");
            } elseif ($key === 'prikazDate') {
                $query->where('prikazs.date', 'like', "%$value%");
            } else {
                $query->where($key, 'like', "%$value%");

            }

        }

        return $query;
    }

    public function default_document(): BelongsTo {
        return $this->belongsTo(DefaultDocument::class, 'name', 'name');
    }
}
