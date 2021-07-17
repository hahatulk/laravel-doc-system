<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
/**
 * @mixin \Eloquent
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class GroupController extends Controller
{
    public function create(Request $request): Collection|array
    {
        $vars = $request->validate([
            'kurs' => 'required|numeric',
            'name' => 'required|string',
            'startDate' => 'required|date',
            'finishDate' => 'required|date',
            'groupType' => 'required|digits_between:0,1',
            'facultet' => 'required|exists:facultets,name',
        ]);

        Group::create($vars);

        return $vars;
    }
}
