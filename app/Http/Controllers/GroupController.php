<?php

namespace App\Http\Controllers;

use App\Http\Requests\GroupCreateRequest;
use App\Http\Requests\GroupDeleteRequest;
use App\Http\Requests\GroupEditRequest;
use App\Http\Requests\GroupListRequest;
use App\Http\Requests\GroupsAllRequest;
use App\Models\Group;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;

/**
 * @mixin Eloquent
 * @mixin Builder
 */
class GroupController extends Controller {
    public function getAll(GroupsAllRequest $request): JsonResponse {
        $vars = $request->validated();

       if ((int)$vars['inProgress'] > 0) {
           $groups = Group::where('inProgress', $vars['inProgress']);
       } else {
           $groups = Group::all();
       }

        return $this->success($groups);
    }

    public function create(GroupCreateRequest $request): JsonResponse {
        $vars = $request->validated();

        Group::create($vars);

        return $this->success();
    }

    /**
     * @throws \JsonException
     */
    public function edit(GroupEditRequest $request): JsonResponse {
        $vars = $request->validated();
//        $vars['values'] = json_decode($vars['values'], JSON_THROW_ON_ERROR | true, 512, JSON_THROW_ON_ERROR);

        Group::whereId($vars['groupId'])->update($vars['values']);

        return $this->success();
    }

    public function delete(GroupDeleteRequest $request): JsonResponse {
        $vars = $request->validated();

        try {
            Group::findOrFail($vars);

            Group::destroy($vars);

            return $this->success();
        } catch (\Exception $e) {
            return $this->error($e);
        }
    }

    public function getList(GroupListRequest $request): \Illuminate\Http\JsonResponse {

        $students = Group::getList($request->filters, $request->sort);

        return $this->success($students->paginate(6));
    }
}
