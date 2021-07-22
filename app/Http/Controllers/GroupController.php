<?php

namespace App\Http\Controllers;

use App\Http\Requests\GroupCreate;
use App\Http\Requests\GroupDelete;
use App\Http\Requests\GroupEdit;
use App\Models\Group;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;

/**
 * @mixin Eloquent
 * @mixin Builder
 */
class GroupController extends Controller {
    public function create(GroupCreate $request): JsonResponse {
        $vars = $request->validated();

        Group::create($vars);

        return $this->success();
    }

    /**
     * @throws \JsonException
     */
    public function edit(GroupEdit $request): JsonResponse {
        $vars = $request->validated();
        $vars['values'] = json_decode($vars['values'], JSON_THROW_ON_ERROR | true, 512, JSON_THROW_ON_ERROR);

        Group::whereId($vars['groupId'])->update($vars['values']);

        return $this->success();
    }

    public function delete(GroupDelete $request): JsonResponse {
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
