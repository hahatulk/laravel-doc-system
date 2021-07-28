<?php

namespace App\Http\Controllers;

use App\Http\Requests\GroupCreateRequest;
use App\Http\Requests\GroupDeleteRequest;
use App\Http\Requests\GroupEditRequest;
use App\Models\Group;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;

/**
 * @mixin Eloquent
 * @mixin Builder
 */
class GroupController extends Controller {
    public function all(){

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
        $vars['values'] = json_decode($vars['values'], JSON_THROW_ON_ERROR | true, 512, JSON_THROW_ON_ERROR);

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
}
