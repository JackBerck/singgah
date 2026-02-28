<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\StaticPageController;
use App\Http\Controllers\Manager\AccommodationController;
use App\Http\Controllers\Manager\AttractionController;
use App\Http\Controllers\Manager\CulinaryController;
use App\Http\Controllers\Manager\DashboardController;
use App\Http\Controllers\Manager\EventController;
use App\Http\Controllers\Manager\ReviewController;
use App\Http\Controllers\Manager\VillageController;
use App\Http\Controllers\Manager\VillageMediaController;
use App\Http\Middleware\EnsureVillageManager;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Public Routes ────────────────────────────────────────────────────────────

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/tentang', [StaticPageController::class, 'about'])->name('about');
Route::get('/privasi', [StaticPageController::class, 'privacy'])->name('privacy');
Route::get('/syarat', [StaticPageController::class, 'terms'])->name('terms');

// ─── General Auth Dashboard ───────────────────────────────────────────────────

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// ─── Village Manager Dashboard ────────────────────────────────────────────────

Route::prefix('manager')
    ->name('manager.')
    ->middleware(['auth', 'verified', EnsureVillageManager::class])
    ->group(function () {
        // Dashboard
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // Village Profile
        Route::get('/village/edit', [VillageController::class, 'edit'])->name('village.edit');
        Route::put('/village', [VillageController::class, 'update'])->name('village.update');

        // Village Media
        Route::post('/village/media', [VillageMediaController::class, 'store'])->name('village.media.store');
        Route::delete('/village/media/{media}', [VillageMediaController::class, 'destroy'])->name('village.media.destroy');

        // Events CRUD
        Route::resource('events', EventController::class)->except(['show']);

        // Attractions CRUD
        Route::resource('attractions', AttractionController::class)->except(['show']);

        // Culinaries CRUD
        Route::resource('culinaries', CulinaryController::class)->except(['show']);

        // Accommodations CRUD
        Route::resource('accommodations', AccommodationController::class)->except(['show']);

        // Reviews (read-only)
        Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');
    });

require __DIR__ . '/settings.php';
