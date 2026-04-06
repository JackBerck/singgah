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
                'events'         => fn($q) => $q->with(['media' => fn($q2) => $q2->where('type', 'image')->limit(1)])->orderBy('event_date'),
                'attractions'    => fn($q) => $q->withAvg('reviews', 'rating')->withCount('reviews')->with(['media' => fn($q2) => $q2->where('type', 'image')->orderBy('order')->limit(1)]),
                'culinaries'     => fn($q) => $q->withAvg('reviews', 'rating')->withCount('reviews')->with(['media' => fn($q2) => $q2->where('type', 'image')->orderBy('order')->limit(1)]),
                'accommodations' => fn($q) => $q->withAvg('reviews', 'rating')->withCount('reviews')->with(['media' => fn($q2) => $q2->where('type', 'image')->orderBy('order')->limit(1)]),
                'reviews'        => fn($q) => $q->visible()->with('user:id,name,avatar')->latest()->limit(30),
            ])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->firstOrFail();

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
            'village'         => $village,
            'userReview'      => $userReview,
            'ratingBreakdown' => $ratingBreakdown,
            'isWishlisted'    => $isWishlisted,
        ]);
    }

    public function showEvent(string $slug, int $id)
    {
        $village = Village::verified()->where('slug', $slug)->firstOrFail();
        $event   = VillageEvent::where('id', $id)
            ->where('village_id', $village->id)
            ->with(['media' => fn($q) => $q->orderBy('order'), 'village:id,name,slug'])
            ->firstOrFail();

        $isWishlisted = false;
        if (auth()->check()) {
            /** @var \App\Models\User $user */
            $user = auth()->user();
            $isWishlisted = $user->hasWishlisted(VillageEvent::class, $event->id);
        }

        return Inertia::render('village/event-detail', [
            'village'      => $village->only('id', 'name', 'slug'),
            'event'        => $event,
            'isWishlisted' => $isWishlisted,
        ]);
    }

    public function showAttraction(Request $request, string $slug, int $id)
    {
        $village    = Village::verified()->where('slug', $slug)->firstOrFail();
        $attraction = Attraction::where('id', $id)
            ->where('village_id', $village->id)
            ->with([
                'media'   => fn($q) => $q->orderBy('order'),
                'reviews' => fn($q) => $q->visible()->with('user:id,name,avatar')->latest()->limit(20),
            ])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->firstOrFail();

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
            'userReview'   => $userReview,
            'isWishlisted' => $isWishlisted,
        ]);
    }

    public function showCulinary(Request $request, string $slug, int $id)
    {
        $village  = Village::verified()->where('slug', $slug)->firstOrFail();
        $culinary = Culinary::where('id', $id)
            ->where('village_id', $village->id)
            ->with([
                'media'   => fn($q) => $q->orderBy('order'),
                'reviews' => fn($q) => $q->visible()->with('user:id,name,avatar')->latest()->limit(20),
            ])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->firstOrFail();

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
            'userReview'   => $userReview,
            'isWishlisted' => $isWishlisted,
        ]);
    }

    public function showAccommodation(Request $request, string $slug, int $id)
    {
        $village       = Village::verified()->where('slug', $slug)->firstOrFail();
        $accommodation = Accommodation::where('id', $id)
            ->where('village_id', $village->id)
            ->with([
                'media'   => fn($q) => $q->orderBy('order'),
                'reviews' => fn($q) => $q->visible()->with('user:id,name,avatar')->latest()->limit(20),
            ])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->firstOrFail();

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
            'userReview'    => $userReview,
            'isWishlisted'  => $isWishlisted,
        ]);
    }
}
