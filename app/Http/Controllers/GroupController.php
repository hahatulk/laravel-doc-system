<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @mixin Eloquent
 * @mixin Builder
 */
class GroupController extends Controller
{
    public function create(Request $request): JsonResponse
    {
        $vars = $request->validate([
            'kurs' => 'required|numeric',
            'name' => 'required|string|unique:groups',
            'startDate' => 'required|date',
            'finishDate' => 'required|date',
            'groupType' => 'required|digits_between:0,1',
            'facultet' => 'required|exists:facultets,name',
        ]);

        Group::create($vars);

        return $this->success('jopa');
    }
}
