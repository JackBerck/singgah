<?php

namespace App\Http\Controllers;

use App\Models\Village;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $verifiedVillages = Village::query()
            ->verified()
            ->get(['category', 'address']);

        // Desa Pilihan — yang is_featured = true dan sudah verified, max 8
        $featuredVillages = Village::query()
            ->verified()
            ->featured()
            ->with(['media' => fn($q) => $q->where('type', 'image')->orderBy('order')->limit(1)])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn(Village $v) => [
                'id'                => $v->id,
                'name'              => $v->name,
                'slug'              => $v->slug,
                'short_description' => $v->short_description,
                'address'           => $v->address,
                'is_featured'       => $v->is_featured,
                'cover_image'       => $v->media->first()?->file_path,
                'reviews_count'     => $v->reviews_count,
                'reviews_avg_rating' => round((float) $v->reviews_avg_rating, 1),
            ]);

        $categoryCounts = $verifiedVillages->countBy('category');
        $provinceCounts = $verifiedVillages
            ->map(fn(Village $v) => $this->extractProvince($v->address))
            ->countBy();

        $categories = collect(Village::categories())
            ->map(fn(string $label, string $slug) => [
                'slug'  => $slug,
                'label' => $label,
                'count' => (int) ($categoryCounts[$slug] ?? 0),
            ])
            ->values();

        $regions = $provinceCounts
            ->sortDesc()
            ->take(8)
            ->map(fn(int $count, string $province) => [
                'province' => $province,
                'count'    => $count,
                'slug'     => Str::slug($province),
            ])
            ->values();

        // Desa Terbaru — terbaru masuk, sudah verified, max 8
        $newVillages = Village::query()
            ->verified()
            ->with(['media' => fn($q) => $q->where('type', 'image')->orderBy('order')->limit(1)])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn(Village $v) => [
                'id'                => $v->id,
                'name'              => $v->name,
                'slug'              => $v->slug,
                'short_description' => $v->short_description,
                'address'           => $v->address,
                'is_featured'       => $v->is_featured,
                'cover_image'       => $v->media->first()?->file_path,
                'reviews_count'     => $v->reviews_count,
                'reviews_avg_rating' => round((float) $v->reviews_avg_rating, 1),
            ]);

        // Stats
        $stats = [
            'villages_count'  => Village::verified()->count(),
            'provinces_count' => $provinceCounts->count(),
            'visitors_count'  => 50000,
        ];

        return Inertia::render('home', [
            'featuredVillages' => $featuredVillages,
            'categories'       => $categories,
            'regions'          => $regions,
            'newVillages'      => $newVillages,
            'stats'            => $stats,
        ]);
    }

    private function extractProvince(?string $address): string
    {
        if (! $address) {
            return 'Indonesia';
        }

        $parts = array_values(array_filter(array_map('trim', explode(',', $address))));

        if ($parts === []) {
            return trim($address) !== '' ? trim($address) : 'Indonesia';
        }

        $province = preg_replace('/\s+\d+$/', '', (string) end($parts));

        return trim($province) !== '' ? trim($province) : 'Indonesia';
    }
}
