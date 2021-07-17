<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function create(Request $request): \Illuminate\Database\Eloquent\Collection|array
    {
        $vars = $request->validate([
           'kurs' => 'required|numeric',
           'name' => 'required|string',
           'startDate' => 'required|date',
           'finishDate' => 'required|date',
           'groupType' => 'required|digits_between:0,1',
           'facultet' => 'required|exists:facultets,name',
        ]);

        return $vars;
    }
}
