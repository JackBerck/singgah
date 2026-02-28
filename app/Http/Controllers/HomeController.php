<?php

namespace App\Http\Controllers;

use App\Models\Village;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
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
            'provinces_count' => 34,
            'visitors_count'  => 50000,
        ];

        return Inertia::render('home', [
            'featuredVillages' => $featuredVillages,
            'newVillages'      => $newVillages,
            'stats'            => $stats,
        ]);
    }
}
