<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserCredentialsEditRequest;
use App\Http\Requests\UserCredentialsRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;

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
}
