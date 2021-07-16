<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\DocumentRequestFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentRequest whereComment($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentRequest whereDocumentName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentRequest whereFullFilled($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentRequest whereFullFilledAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentRequest whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentRequest whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DocumentRequest whereUserId($value)
 * @mixin \Eloquent
 */
class DocumentRequest extends Model
{
    use HasFactory;
}
