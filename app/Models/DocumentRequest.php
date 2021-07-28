<?php

namespace App\Models;

use Database\Factories\DocumentRequestFactory;
use DB;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\DocumentRequest
 *
 * @property int $id
 * @property int $userId
 * @property string $documentName
 * @property int $status
 * @property int $fullFilled
 * @property string $fullFilledAt
 * @property string|null $comment
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static DocumentRequestFactory factory(...$parameters)
 * @method static Builder|DocumentRequest newModelQuery()
 * @method static Builder|DocumentRequest newQuery()
 * @method static Builder|DocumentRequest query()
 * @method static Builder|DocumentRequest whereComment($value)
 * @method static Builder|DocumentRequest whereCreatedAt($value)
 * @method static Builder|DocumentRequest whereDocumentName($value)
 * @method static Builder|DocumentRequest whereFullFilled($value)
 * @method static Builder|DocumentRequest whereFullFilledAt($value)
 * @method static Builder|DocumentRequest whereId($value)
 * @method static Builder|DocumentRequest whereStatus($value)
 * @method static Builder|DocumentRequest whereUpdatedAt($value)
 * @method static Builder|DocumentRequest whereUserId($value)
 * @mixin Eloquent
 */
class DocumentRequest extends Model {
    use HasFactory;

    protected $fillable = [
        'userId',
        'documentName',
        'status',
        'fullFilled',
        'fullFilledAt',
        'comment',
    ];

    public static function summary(): \Illuminate\Support\Collection {
        return self::select([
            DB::raw("COUNT(*) as total"),
            DB::raw("SUM(CASE WHEN document_requests.status IN ('1') THEN 1 ELSE 0 END)  as pending"),
            DB::raw("SUM(CASE WHEN document_requests.status IN ('-1') THEN 1 ELSE 0 END) as canceled"),
            DB::raw("SUM(CASE WHEN document_requests.status IN ('0') THEN 1 ELSE 0 END)  as successful"),
        ])
            ->join('students', 'document_requests.userId', '=', 'students.userId')
            ->get();
    }

    public static function orderCount(int $userId, string $orderType)  {
        return self::select([
            DB::raw("COUNT(*) as total"),
        ])
            ->join('users', 'document_requests.userId', '=', 'users.id')
            ->where([
                ['document_requests.documentName', '=', $orderType],
                ['users.id', '=', $userId],
            ])
            ->first();
    }

    //дефолтный запрос на список
    public static function getList(array|null $filters = null, array|null $sort = null): Builder {
        $query = self::select([
            "document_requests.id           as id",
            "default_documents.title        as title",
            "document_requests.documentName as documentName",
            "document_requests.created_at    as createdAt",
            "document_requests.status       as status",
            "document_requests.comment      as comment",
            "users.id                       as userId",
            "document_requests.fullFilled   as fullFilled",
            "document_requests.fullFilledAt as fullFilledAt",
        ])
            ->join('users', 'document_requests.userId', '=', 'users.id')
            ->join('default_documents', 'document_requests.documentName', '=', 'default_documents.name');

        if (!empty($filters)) {
            $query->whereFilter($filters);
        }

        if (!empty($sort)) {
            $query->orderBy($sort['columnName'], $sort['direction']);
        }

        return $query;
    }

    //обработка фильтров при поиске
    protected function scopeWhereFilter(Builder $query, array $filters): Builder {
        if (empty($filters)) {
            return $query;
        }

        foreach ($filters as $key => $value) {
            // Пустые значения пропускаем
            if (empty($value)) {
                continue;
            }

            if ($key === 'gender') {
                if (str_contains('женский', $value)) {
                    $query->where('students.gender', 'женский');
                } elseif (str_contains('мужской', $value)) {
                    $query->where('students.gender', 'мужской');
                }
            }
//            elseif ($key === 'id') {
//                $query->where('tasks.id', $value);
//            }
            else {
                $query->where($key, 'like', "%$value%");
            }

//            dd($key);
        }

        return $query;
    }

}
