<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\StaticPageController;
use App\Http\Controllers\ExploreController;
use App\Http\Controllers\VillageProfileController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\AiChatController;
use App\Http\Controllers\Public\ReviewController as PublicReviewController;
use App\Http\Controllers\Public\WishlistController;
use App\Http\Controllers\Auth\RegisteredManagerController;
use App\Http\Controllers\Manager\AccommodationController;
use App\Http\Controllers\Manager\AttractionController;
use App\Http\Controllers\Manager\CulinaryController;
use App\Http\Controllers\Manager\DashboardController;
use App\Http\Controllers\Manager\EventController;
use App\Http\Controllers\Manager\MediaController;
use App\Http\Controllers\Manager\ReviewController;
use App\Http\Controllers\Manager\VillageController;
use App\Http\Controllers\Manager\VillageMediaController;
use App\Http\Middleware\EnsureVillageManager;
use App\Http\Middleware\EnsureAdmin;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Public Routes ────────────────────────────────────────────────────────────

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/tentang', [StaticPageController::class, 'about'])->name('about');
Route::get('/privasi', [StaticPageController::class, 'privacy'])->name('privacy');
Route::get('/syarat', [StaticPageController::class, 'terms'])->name('terms');

// Explore & Village Profile
Route::get('/explore', [ExploreController::class, 'index'])->name('explore');
Route::get('/desa/{slug}', [VillageProfileController::class, 'show'])->name('village.show');
Route::get('/desa/{slug}/events/{itemSlug}', [VillageProfileController::class, 'showEvent'])->name('village.event');
Route::get('/desa/{slug}/attractions/{itemSlug}', [VillageProfileController::class, 'showAttraction'])->name('village.attraction');
Route::get('/desa/{slug}/culinaries/{itemSlug}', [VillageProfileController::class, 'showCulinary'])->name('village.culinary');
Route::get('/desa/{slug}/accommodations/{itemSlug}', [VillageProfileController::class, 'showAccommodation'])->name('village.accommodation');

// Manager Registration
Route::get('/register/pengelola', [RegisteredManagerController::class, 'create'])->name('register.manager');
Route::post('/register/pengelola', [RegisteredManagerController::class, 'store'])->name('register.manager.store');
Route::get('/register/pengelola/sukses', [RegisteredManagerController::class, 'success'])->name('register.manager.success');

// AI Chat (accessible to all: guest & auth)
Route::post('/ai/chat', [AiChatController::class, 'chat'])
    ->middleware(['throttle:30,1'])
    ->name('ai.chat');

// Authenticated-only routes
Route::middleware(['auth'])->group(function () {
    // Reviews
    Route::post('/reviews', [PublicReviewController::class, 'store'])->name('reviews.store');
    Route::put('/reviews/{review}', [PublicReviewController::class, 'update'])->name('reviews.update');
    Route::delete('/reviews/{review}', [PublicReviewController::class, 'destroy'])->name('reviews.destroy');

    // Wishlist toggle (AJAX)
    Route::post('/wishlist/toggle', [WishlistController::class, 'toggle'])->name('wishlist.toggle');

    // User Profile pages (separate pages)
    Route::get('/profil', [UserProfileController::class, 'show'])->name('profil.show');
    Route::get('/profil/keamanan', [UserProfileController::class, 'keamanan'])->name('profil.keamanan');
    Route::get('/profil/ulasan', [UserProfileController::class, 'ulasan'])->name('profil.ulasan');
    Route::get('/profil/wishlist', [WishlistController::class, 'index'])->name('profil.wishlist');
    Route::post('/profil', [UserProfileController::class, 'update'])->name('profil.update');
    Route::put('/profil/password', [UserProfileController::class, 'updatePassword'])->name('profil.password');
});
// ─── General Auth Dashboard ───────────────────────────────────────────────────

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// ─── Village Manager Dashboard ────────────────────────────────────────────────

Route::prefix('manager')
    ->name('manager.')
    ->middleware(['auth', 'verified', EnsureVillageManager::class])
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/village/edit', [VillageController::class, 'edit'])->name('village.edit');
        Route::put('/village', [VillageController::class, 'update'])->name('village.update');
        Route::post('/village/media', [VillageMediaController::class, 'store'])->name('village.media.store');
        Route::delete('/village/media/{media}', [VillageMediaController::class, 'destroy'])->name('village.media.destroy');
        Route::delete('/media/{media}', [MediaController::class, 'destroy'])->name('media.destroy');
        Route::resource('events', EventController::class)->except(['show']);
        Route::resource('attractions', AttractionController::class)->except(['show']);
        Route::resource('culinaries', CulinaryController::class)->except(['show']);
        Route::resource('accommodations', AccommodationController::class)->except(['show']);
        Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');
    });

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'verified', EnsureAdmin::class])
    ->group(function () {
        // Dashboard overview
        Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

        // Users
        Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
        Route::get('/users/{user}/edit', [\App\Http\Controllers\Admin\UserController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');
        Route::patch('/users/{user}/password', [\App\Http\Controllers\Admin\UserController::class, 'updatePassword'])->name('users.password');

        // Villages
        Route::get('/villages', [\App\Http\Controllers\Admin\VillageController::class, 'index'])->name('villages.index');
        Route::get('/villages/{village}', function ($village) {
            return redirect()->route('admin.villages.edit', $village);
        });
        Route::get('/villages/{village}/edit', [\App\Http\Controllers\Admin\VillageController::class, 'edit'])->name('villages.edit');
        Route::match(['post', 'put'], '/villages/{village}', [\App\Http\Controllers\Admin\VillageController::class, 'update'])->name('villages.update');
        Route::delete('/villages/{village}', [\App\Http\Controllers\Admin\VillageController::class, 'destroy'])->name('villages.destroy');
        Route::patch('/villages/{village}/verify', [\App\Http\Controllers\Admin\VillageController::class, 'verify'])->name('villages.verify');
        Route::patch('/villages/{village}/reject', [\App\Http\Controllers\Admin\VillageController::class, 'reject'])->name('villages.reject');
        Route::patch('/villages/{village}/toggle-featured', [\App\Http\Controllers\Admin\VillageController::class, 'toggleFeatured'])->name('villages.toggle-featured');
        Route::post('/villages/{village}/media', [\App\Http\Controllers\Admin\VillageMediaController::class, 'store'])->name('villages.media.store');

        // Generic media delete (admin can delete any media)
        Route::delete('/media/{media}', [\App\Http\Controllers\Admin\MediaController::class, 'destroy'])->name('media.destroy');

        // Events
        Route::get('/events', [\App\Http\Controllers\Admin\EventController::class, 'index'])->name('events.index');
        Route::get('/events/{event}', function ($event) {
            return redirect()->route('admin.events.edit', $event);
        });
        Route::get('/events/{event}/edit', [\App\Http\Controllers\Admin\EventController::class, 'edit'])->name('events.edit');
        Route::match(['post', 'put'], '/events/{event}', [\App\Http\Controllers\Admin\EventController::class, 'update'])->name('events.update');
        Route::delete('/events/{event}', [\App\Http\Controllers\Admin\EventController::class, 'destroy'])->name('events.destroy');
        Route::post('/events/{event}/media', [\App\Http\Controllers\Admin\EventMediaController::class, 'store'])->name('events.media.store');

        // Attractions
        Route::get('/attractions', [\App\Http\Controllers\Admin\AttractionController::class, 'index'])->name('attractions.index');
        Route::get('/attractions/{attraction}', function ($attraction) {
            return redirect()->route('admin.attractions.edit', $attraction);
        });
        Route::get('/attractions/{attraction}/edit', [\App\Http\Controllers\Admin\AttractionController::class, 'edit'])->name('attractions.edit');
        Route::match(['post', 'put'], '/attractions/{attraction}', [\App\Http\Controllers\Admin\AttractionController::class, 'update'])->name('attractions.update');
        Route::delete('/attractions/{attraction}', [\App\Http\Controllers\Admin\AttractionController::class, 'destroy'])->name('attractions.destroy');
        Route::post('/attractions/{attraction}/media', [\App\Http\Controllers\Admin\AttractionMediaController::class, 'store'])->name('attractions.media.store');

        // Culinaries
        Route::get('/culinaries', [\App\Http\Controllers\Admin\CulinaryController::class, 'index'])->name('culinaries.index');
        Route::get('/culinaries/{culinary}', function ($culinary) {
            return redirect()->route('admin.culinaries.edit', $culinary);
        });
        Route::get('/culinaries/{culinary}/edit', [\App\Http\Controllers\Admin\CulinaryController::class, 'edit'])->name('culinaries.edit');
        Route::match(['post', 'put'], '/culinaries/{culinary}', [\App\Http\Controllers\Admin\CulinaryController::class, 'update'])->name('culinaries.update');
        Route::delete('/culinaries/{culinary}', [\App\Http\Controllers\Admin\CulinaryController::class, 'destroy'])->name('culinaries.destroy');
        Route::post('/culinaries/{culinary}/media', [\App\Http\Controllers\Admin\CulinaryMediaController::class, 'store'])->name('culinaries.media.store');

        // Accommodations
        Route::get('/accommodations', [\App\Http\Controllers\Admin\AccommodationController::class, 'index'])->name('accommodations.index');
        Route::get('/accommodations/{accommodation}', function ($accommodation) {
            return redirect()->route('admin.accommodations.edit', $accommodation);
        });
        Route::get('/accommodations/{accommodation}/edit', [\App\Http\Controllers\Admin\AccommodationController::class, 'edit'])->name('accommodations.edit');
        Route::match(['post', 'put'], '/accommodations/{accommodation}', [\App\Http\Controllers\Admin\AccommodationController::class, 'update'])->name('accommodations.update');
        Route::delete('/accommodations/{accommodation}', [\App\Http\Controllers\Admin\AccommodationController::class, 'destroy'])->name('accommodations.destroy');
        Route::post('/accommodations/{accommodation}/media', [\App\Http\Controllers\Admin\AccommodationMediaController::class, 'store'])->name('accommodations.media.store');

        // Reviews
        Route::get('/reviews', [\App\Http\Controllers\Admin\ReviewController::class, 'index'])->name('reviews.index');
        Route::delete('/reviews/{review}', [\App\Http\Controllers\Admin\ReviewController::class, 'destroy'])->name('reviews.destroy');
    });

// ─── Development: Error Testing Routes ───────────────────────────────────────
// Uncomment these routes to test error pages in development
// Remove or comment out in production

if (app()->environment('local')) {
    Route::prefix('test-error')->group(function () {
        Route::get('/400', fn() => abort(400));
        Route::get('/401', fn() => abort(401));
        Route::get('/403', fn() => abort(403));
        Route::get('/404', fn() => abort(404));
        Route::get('/500', fn() => abort(500));
        Route::get('/503', fn() => abort(503));
    });
}

require __DIR__ . '/settings.php';
