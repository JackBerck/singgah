<?php

namespace App\Http\Controllers;

use App\Models\Village;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExploreController extends Controller
{
    public function index(Request $request)
    {
        $search    = $request->input('search', '');
        $wilayah   = $request->input('wilayah', '');
        $sort      = $request->input('sort', 'terbaru');
        $ratingMin = $request->input('rating_min', '');

        $query = Village::verified()
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->with(['media' => fn($q) => $q->where('type', 'image')->orderBy('order')->limit(1)]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('short_description', 'ilike', "%{$search}%")
                    ->orWhere('address', 'ilike', "%{$search}%");
            });
        }

        if ($wilayah) {
            $query->where('address', 'ilike', "%{$wilayah}%");
        }

        match ($sort) {
            'rating'  => $query->orderByDesc('reviews_avg_rating'),
            'nama'    => $query->orderBy('name'),
            default   => $query->latest(),
        };

        if ($ratingMin && is_numeric($ratingMin)) {
            $query->having('reviews_avg_rating', '>=', (float) $ratingMin);
        }

        $villages = $query->paginate(12)->withQueryString();

        // Format for frontend
        $villages->through(function ($v) {
            $v->cover_image = $v->media->first()?->file_path;
            $v->reviews_avg_rating = round((float) $v->reviews_avg_rating, 1);
            unset($v->media);
            return $v;
        });

        return Inertia::render('explore', [
            'villages' => $villages,
            'filters'  => [
                'search'     => $search,
                'wilayah'    => $wilayah,
                'sort'       => $sort,
                'rating_min' => $ratingMin,
            ],
        ]);
    }
}
