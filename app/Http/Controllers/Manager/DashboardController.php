<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Village;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $village = Village::where('manager_id', $request->user()->id)
            ->with(['media'])
            ->withCount(['events', 'attractions', 'culinaries', 'accommodations', 'reviews'])
            ->withAvg('reviews', 'rating')
            ->firstOrFail();

        $recentEvents = $village->events()
            ->latest('event_date')
            ->take(5)
            ->get(['id', 'name', 'event_date', 'is_featured']);

        $recentAttractions = $village->attractions()
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'price_min', 'price_max', 'location']);

        $recentCulinaries = $village->culinaries()
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'price_min', 'price_max', 'location']);

        $recentAccommodations = $village->accommodations()
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'price_min', 'price_max', 'location']);

        $stats = [
            'total_content'     => $village->events_count + $village->attractions_count + $village->culinaries_count + $village->accommodations_count,
            'events_count'      => $village->events_count,
            'attractions_count' => $village->attractions_count,
            'culinaries_count'  => $village->culinaries_count,
            'accommodations_count' => $village->accommodations_count,
            'reviews_count'     => $village->reviews_count,
            'avg_rating'        => round($village->reviews_avg_rating ?? 0, 1),
            'status'            => $village->status,
            'rejected_reason'   => $village->rejected_reason,
        ];

        return Inertia::render('manager/dashboard', [
            'village'             => $village,
            'stats'               => $stats,
            'recentEvents'        => $recentEvents,
            'recentAttractions'   => $recentAttractions,
            'recentCulinaries'    => $recentCulinaries,
            'recentAccommodations' => $recentAccommodations,
        ]);
    }
}
