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
//    public function find(Request $request): \Illuminate\Database\Eloquent\Model|\Illuminate\Database\Eloquent\Collection|array|Group|null
//    {
//        return Group::find($request->get('id'));
//    }

//    public function findAll(Request $request): \Illuminate\Database\Eloquent\Collection|array
//    {
//        return Group::all();
//    }

//    public function findAllWithSortFilter(Request $request): \Illuminate\Database\Eloquent\Collection|array
//    {
//        $vars = $request->validate([
//            'offset' => 'required|numeric',
//            'limit' => 'required|numeric',
//            'sort' => 'required',
//            'filters' => 'required',
//        ]);
//
//        return Group::all();
//    }

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

    public function delete(Request $request): JsonResponse
    {
        $vars = $request->validate([
            'groupId' => 'required|numeric',
        ]);

        Group::destroy($vars);

        return $this->success($vars);
    }
}
