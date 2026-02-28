<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Village;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $village = Village::where('manager_id', $request->user()->id)->firstOrFail();

        $reviews = $village->reviews()
            ->with('user:id,name,avatar')
            ->latest()
            ->paginate(12);

        return Inertia::render('manager/reviews/index', [
            'village' => $village,
            'reviews' => $reviews,
        ]);
    }
}
