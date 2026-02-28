<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class StaticPageController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('about');
    }

    public function privacy(): Response
    {
        return Inertia::render('privacy');
    }

    public function terms(): Response
    {
        return Inertia::render('terms');
    }
}
