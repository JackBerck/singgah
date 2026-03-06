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
        $kategori  = $request->input('kategori', '');
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

        if ($kategori) {
            $query->where('category', $kategori);
        }

        // Apply rating filter before ordering
        if ($ratingMin && is_numeric($ratingMin)) {
            $minRating = (float) $ratingMin;
            $query->whereHas('reviews', function ($q) {
                $q->selectRaw('1');
            })->whereRaw(
                '(SELECT AVG(rating) FROM reviews WHERE reviews.reviewable_id = villages.id AND reviews.reviewable_type = ?) >= ?',
                [Village::class, $minRating]
            );
        }

        match ($sort) {
            'rating'  => $query->orderByDesc('reviews_avg_rating'),
            'nama'    => $query->orderBy('name'),
            default   => $query->latest(),
        };

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
                'kategori'   => $kategori,
                'sort'       => $sort,
                'rating_min' => $ratingMin,
            ],
        ]);
    }
}
