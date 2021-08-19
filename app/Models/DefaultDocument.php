<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * App\Models\DefaultDocument
 *
 * @property int $id
 * @property string $title
 * @property string $name
 * @property string $type
 * @property string|null $path
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\DefaultDocumentFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|DefaultDocument newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DefaultDocument newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DefaultDocument query()
 * @method static \Illuminate\Database\Eloquent\Builder|DefaultDocument whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DefaultDocument whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DefaultDocument whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DefaultDocument wherePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DefaultDocument whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DefaultDocument whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DefaultDocument whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class DefaultDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'name',
        'type',
        'path',
    ];

    public static function getPrikazTypes(): Builder {
        $query = self::select([
            'default_documents.id    as id',
            'default_documents.name  as name',
            'default_documents.title as title',
        ])
            ->where([
                ['default_documents.type', '=', 'приказ'],
                ['default_documents.name', '!=', Prikaz::PRIKAZ_ZACHISLENIE],
            ]);

        return $query;
    }

    public function importTemplateDownload(): BinaryFileResponse {
        $headers = [
            'Content-type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="import.xlsx"',
        ];

        return response()->download(Storage::path('templates/import.xlsx'), 'import.xlsx', $headers);
    }

}
