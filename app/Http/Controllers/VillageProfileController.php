<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Attraction;
use App\Models\Culinary;
use App\Models\Village;
use App\Models\VillageEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VillageProfileController extends Controller
{
    public function show(Request $request, string $slug)
    {
        $village = Village::verified()
            ->where('slug', $slug)
            ->with([
                'manager:id,name,phone',
                'media'          => fn($q) => $q->orderBy('order'),
                // Reviews for village are kept simple for now
                'reviews'        => fn($q) => $q->visible()->with('user:id,name,avatar')->latest()->limit(30),
            ])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->firstOrFail();

        // Paginate contents
        $events = $village->events()
            ->with(['media' => fn($q) => $q->where('type', 'image')->limit(1)])
            ->orderBy('event_date')
            ->paginate(6, ['*'], 'event_page');

        $attractions = $village->attractions()
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->with(['media' => fn($q) => $q->where('type', 'image')->orderBy('order')->limit(1)])
            ->paginate(6, ['*'], 'attraction_page');

        $culinaries = $village->culinaries()
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->with(['media' => fn($q) => $q->where('type', 'image')->orderBy('order')->limit(1)])
            ->paginate(6, ['*'], 'culinary_page');

        $accommodations = $village->accommodations()
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->with(['media' => fn($q) => $q->where('type', 'image')->orderBy('order')->limit(1)])
            ->paginate(6, ['*'], 'accommodation_page');

        // Note: I attach events, attractions etc back to village object in the backend array just for ease, 
        // to avoid mass changing the frontend data structure, but actually they are paginators now.
        // Wait, if they are paginators, they have `data` and `links`.
        // I will pass them separately so frontend maps over `events.data`.
        
        $villageData = $village->toArray();
        // Remove old relations if any
        unset($villageData['events'], $villageData['attractions'], $villageData['culinaries'], $villageData['accommodations']);

        $userReview = null;
        $isWishlisted = false;
        if (auth()->check()) {
            /** @var \App\Models\User $user */
            $user = auth()->user();
            $userReview   = $village->reviews()->where('user_id', $user->id)->first();
            $isWishlisted = $user->hasWishlisted(Village::class, $village->id);
        }

        $ratingBreakdown = [];
        for ($i = 5; $i >= 1; $i--) {
            $ratingBreakdown[$i] = $village->reviews->where('rating', $i)->count();
        }

        return Inertia::render('village/show', [
            'village'         => $villageData,
            'events'          => $events,
            'attractions'     => $attractions,
            'culinaries'      => $culinaries,
            'accommodations'  => $accommodations,
            'userReview'      => $userReview,
            'ratingBreakdown' => $ratingBreakdown,
            'isWishlisted'    => $isWishlisted,
        ]);
    }

    public function showEvent(string $slug, string $itemSlug)
    {
        $village = Village::verified()->where('slug', $slug)->firstOrFail();
        $event   = VillageEvent::where('slug', $itemSlug)
            ->where('village_id', $village->id)
            ->with(['media' => fn($q) => $q->orderBy('order'), 'village:id,name,slug'])
            ->firstOrFail();

        $reviews = $event->reviews()->visible()->with('user:id,name,avatar')->latest()->paginate(5);

        $userReview = null;
        $isWishlisted = false;
        if (auth()->check()) {
            /** @var \App\Models\User $user */
            $user = auth()->user();
            $isWishlisted = $user->hasWishlisted(VillageEvent::class, $event->id);
            $userReview = $event->reviews()->where('user_id', $user->id)->first();
        }

        return Inertia::render('village/event-detail', [
            'village'      => $village->only('id', 'name', 'slug'),
            'event'        => $event,
            'reviews'      => $reviews,
            'userReview'   => $userReview,
            'isWishlisted' => $isWishlisted,
        ]);
    }

    public function showAttraction(Request $request, string $slug, string $itemSlug)
    {
        $village    = Village::verified()->where('slug', $slug)->firstOrFail();
        $attraction = Attraction::where('slug', $itemSlug)
            ->where('village_id', $village->id)
            ->with(['media'   => fn($q) => $q->orderBy('order')])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->firstOrFail();

        $reviews = $attraction->reviews()->visible()->with('user:id,name,avatar')->latest()->paginate(5);

        $userReview   = null;
        $isWishlisted = false;
        if (auth()->check()) {
            /** @var \App\Models\User $user */
            $user = auth()->user();
            $userReview   = $attraction->reviews()->where('user_id', $user->id)->first();
            $isWishlisted = $user->hasWishlisted(Attraction::class, $attraction->id);
        }

        return Inertia::render('village/attraction-detail', [
            'village'      => $village->only('id', 'name', 'slug'),
            'attraction'   => $attraction,
            'reviews'      => $reviews,
            'userReview'   => $userReview,
            'isWishlisted' => $isWishlisted,
        ]);
    }

    public function showCulinary(Request $request, string $slug, string $itemSlug)
    {
        $village  = Village::verified()->where('slug', $slug)->firstOrFail();
        $culinary = Culinary::where('slug', $itemSlug)
            ->where('village_id', $village->id)
            ->with(['media'   => fn($q) => $q->orderBy('order')])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->firstOrFail();

        $reviews = $culinary->reviews()->visible()->with('user:id,name,avatar')->latest()->paginate(5);

        $userReview   = null;
        $isWishlisted = false;
        if (auth()->check()) {
            /** @var \App\Models\User $user */
            $user = auth()->user();
            $userReview   = $culinary->reviews()->where('user_id', $user->id)->first();
            $isWishlisted = $user->hasWishlisted(Culinary::class, $culinary->id);
        }

        return Inertia::render('village/culinary-detail', [
            'village'      => $village->only('id', 'name', 'slug'),
            'culinary'     => $culinary,
            'reviews'      => $reviews,
            'userReview'   => $userReview,
            'isWishlisted' => $isWishlisted,
        ]);
    }

    public function showAccommodation(Request $request, string $slug, string $itemSlug)
    {
        $village       = Village::verified()->where('slug', $slug)->firstOrFail();
        $accommodation = Accommodation::where('slug', $itemSlug)
            ->where('village_id', $village->id)
            ->with(['media'   => fn($q) => $q->orderBy('order')])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->firstOrFail();

        $reviews = $accommodation->reviews()->visible()->with('user:id,name,avatar')->latest()->paginate(5);

        $userReview   = null;
        $isWishlisted = false;
        if (auth()->check()) {
            /** @var \App\Models\User $user */
            $user = auth()->user();
            $userReview   = $accommodation->reviews()->where('user_id', $user->id)->first();
            $isWishlisted = $user->hasWishlisted(Accommodation::class, $accommodation->id);
        }

        return Inertia::render('village/accommodation-detail', [
            'village'       => $village->only('id', 'name', 'slug'),
            'accommodation' => $accommodation,
            'reviews'       => $reviews,
            'userReview'    => $userReview,
            'isWishlisted'  => $isWishlisted,
        ]);
    }
}
