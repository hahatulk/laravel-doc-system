<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function getAll(Request $request): Collection|array
    {
        return User::all();
    }
}
