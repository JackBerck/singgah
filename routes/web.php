<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\StaticPageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/tentang', [StaticPageController::class, 'about'])->name('about');
Route::get('/privasi', [StaticPageController::class, 'privacy'])->name('privacy');
Route::get('/syarat', [StaticPageController::class, 'terms'])->name('terms');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__ . '/settings.php';
