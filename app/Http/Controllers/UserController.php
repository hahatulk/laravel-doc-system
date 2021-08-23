<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdminsCreateRequest;
use App\Http\Requests\AdminsDeleteRequest;
use App\Http\Requests\AdminsListRequest;
use App\Http\Requests\UserCredentialsEditRequest;
use App\Http\Requests\UserCredentialsRequest;
use App\Models\Moderator;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class UserController extends Controller {

    public function getAll(UserCredentialsRequest $request): Collection|array {
        return User::all();
    }

    public function credentials(UserCredentialsRequest $request): JsonResponse {
        $vars = $request->validated();
        $credentials = User::find($vars['userId'])
            ->makeVisible(['password']);

        return $this->success($credentials);
    }

    public function editCredentials(UserCredentialsEditRequest $request): JsonResponse {
        $vars = $request->validated();

        $user = User::findByUsername($vars['original_username']);

        if ($user) {
            $user->username = $vars['username'];
            $user->password = $vars['password'];
//            $user->status = $vars['status'];

            $user->save();
        } else {
            $this->error('User not found', [], 404);
        }

        return $this->success($user);
    }

    public function createAdmin(AdminsCreateRequest $request): JsonResponse {
        $userFio = $request->fio;
        $userPwd = $request->password ?? Str::random(10);
        $user = User::create([
            'username' => (int)User::max('username') + 1,
            'password' => $userPwd,
            'role' => 'admin',
        ]);
        Moderator::create([
            'userId' => $user->id,
            'fio' => $userFio,
        ]);
        return $this->success();
    }

    public function getAdminsList(AdminsListRequest $request): JsonResponse {
        $admins = Moderator::getAdminsList($request->filters, $request->sort);
        return $this->success($admins->paginate($request->per_page));
    }

    public function deleteAdmin(AdminsDeleteRequest $request): JsonResponse {
        User::find($request->userId)->delete();
        return $this->success();
    }
}
