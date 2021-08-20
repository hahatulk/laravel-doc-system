<?php

namespace App\Models;

use Database\Factories\DocumentRequestFactory;
use DB;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
 * @property-read \App\Models\DefaultDocument $default_document
 * @method static Builder|DocumentRequest whereFilter(array $filters)
 * @property-read \App\Models\Student $student
 */
class DocumentRequest extends Model {
    use HasFactory;

    public const ORDER_COMPLETED = 1;
    public const ORDER_ACTIVE = 0;
    public const ORDER_CLOSED = -1;

    public const SPRAVKA_OB_OBUCHENII = 'spravka_ob_obuchenii';

    protected $fillable = [
        'userId',
        'documentName',
        'status',
        'fullFilled',
        'fullFilledAt',
        'comment',
    ];

    public static function summary(): Builder {
        return self::select([
            DB::raw("COUNT(*) as total"),
            DB::raw("SUM(CASE WHEN document_requests.status IN ('1') THEN 1 ELSE 0 END)  as pending"),
            DB::raw("SUM(CASE WHEN document_requests.status IN ('-1') THEN 1 ELSE 0 END) as canceled"),
            DB::raw("SUM(CASE WHEN document_requests.status IN ('0') THEN 1 ELSE 0 END)  as successful"),
        ])
            ->join('students', 'document_requests.userId', '=', 'students.userId');
    }

    //дефолтный запрос на count
    public static function orderCount(int $userId, string $orderType): Builder {
        return self::select([
            DB::raw("COUNT(*) as total"),
        ])
            ->join('users', 'document_requests.userId', '=', 'users.id')
            ->where([
                ['document_requests.documentName', '=', $orderType],
                ['users.id', '=', $userId],
            ]);
    }

    //дефолтный запрос на список
    public static function getList(array|null $filters = null, array|null $sort = null): Builder {
        $query = self::select([
            "users.id                       as userId",
            "document_requests.id           as id",
            "default_documents.title        as title",
            "document_requests.documentName as documentName",
            "document_requests.created_at   as createdAt",
            "document_requests.status       as status",
            "document_requests.comment      as comment",
            "document_requests.fullFilled   as fullFilled",
            "document_requests.fullFilledAt as fullFilledAt",
            "document_requests.updated_at   as updatedAt",
        ])
            ->join('users', 'document_requests.userId', '=', 'users.id')
            ->join('default_documents', 'document_requests.documentName', '=', 'default_documents.name');

        if (!empty($filters)) {
            $query->whereFilter($filters);
        }

        if (!empty($sort)) {
            $query->orderBy($sort[0]['columnName'], $sort[0]['direction']);
        }

        return $query;
    }

    public static function whereInactive(Builder $query): Builder {
        return $query
            ->where([
                ['document_requests.status', '!=', '0']
            ]);
    }

    public static function whereActive(Builder $query): Builder {
        return $query
            ->where([
                ['document_requests.status', '=', '0']
            ]);
    }

    //обработка фильтров при поиске
    public function scopeWhereFilter(Builder $query, array $filters): Builder {
        if (empty($filters)) {
            return $query;
        }

        foreach ($filters as $filter) {
            $key = $filter['columnName'];
            $value = $filter['value'];

            if ($key === 'createdAt') {
                $query->where('document_requests.created_at', 'like', "%$value%");
            } elseif ($key === 'id') {
                $query->where('document_requests.id', 'like', "%$value%");
            } else {
                $query->where($key, 'like', "%$value%");

            }

        }

        return $query;
    }

    public function default_document(): BelongsTo {
        return $this->belongsTo(DefaultDocument::class, 'documentName', 'name');
    }

    public function student(): BelongsTo {
        return $this->belongsTo(Student::class, 'userId', 'userId');
    }

}
