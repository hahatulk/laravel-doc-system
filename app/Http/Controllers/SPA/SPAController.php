<?php

namespace App\Http\Controllers\SPA;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;

class SPAController extends Controller
{
    /**
     * @return Application|Factory|View
     */
    public function index(): Factory|View|Application
    {
        return view('app');
    }
}
