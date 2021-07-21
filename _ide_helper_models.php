<?php

// @formatter:off
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
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
	class DefaultDocument extends \Eloquent {}
}

namespace App\Models{
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
	class DocumentRequest extends \Eloquent {}
}

namespace App\Models{
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
	class Facultet extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Group
 *
 * @property int $id
 * @property string $name
 * @property int $inProgress
 * @property int $kurs
 * @property string $startDate
 * @property string $finishDate
 * @property int $groupType
 * @property string $facultet
 * @property int $prikazOtchislenieN
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\GroupFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|Group newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Group newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Group query()
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereFacultet($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereFinishDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereGroupType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereInProgress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereKurs($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group wherePrikazOtchislenieN($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Group whereUpdatedAt($value)
 * @mixin \Eloquent
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
	class Group extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Moderator
 *
 * @property int $id
 * @property int $userId
 * @property string $fio
 * @property string|null $gender
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\ModeratorFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator query()
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator whereFio($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Moderator whereUserId($value)
 * @mixin \Eloquent
 */
	class Moderator extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Prikaz
 *
 * @property int $id
 * @property int $userId
 * @property int $N
 * @property string $name
 * @property string $date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\PrikazFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz query()
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz whereN($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz whereUserId($value)
 * @mixin \Eloquent
 * @property string $title
 * @method static \Illuminate\Database\Eloquent\Builder|Prikaz whereTitle($value)
 */
	class Prikaz extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Role
 *
 * @property int $id
 * @property string $role
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\RoleFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|Role newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Role newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Role query()
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	class Role extends \Eloquent {}
}

namespace App\Models{
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
	class Student extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\User
 *
 * @property int $id
 * @property string $username
 * @property string $password
 * @property string $role
 * @property int $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection|Client[] $clients
 * @property-read int|null $clients_count
 * @property-read DatabaseNotificationCollection|DatabaseNotification[] $notifications
 * @property-read int|null $notifications_count
 * @property-read Collection|Token[] $tokens
 * @property-read int|null $tokens_count
 * @method static UserFactory factory(...$parameters)
 * @method static Builder|User newModelQuery()
 * @method static Builder|User newQuery()
 * @method static Builder|User query()
 * @method static Builder|User whereCreatedAt($value)
 * @method static Builder|User whereId($value)
 * @method static Builder|User wherePassword($value)
 * @method static Builder|User whereRole($value)
 * @method static Builder|User whereStatus($value)
 * @method static Builder|User whereUpdatedAt($value)
 * @method static Builder|User whereUsername($value)
 * @mixin Eloquent
 */
	class User extends \Eloquent {}
}

