<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Review::with([
            'user:id,name,email,avatar',
            'reviewable',
        ]);

        if ($search = $request->get('search')) {
            $query->where('comment', 'like', "%{$search}%")
                ->orWhereHas('user', fn($q) => $q->where('name', 'like', "%{$search}%"));
        }

        if ($rating = $request->get('rating')) {
            $query->where('rating', $rating);
        }

        $reviews = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/reviews/index', [
            'reviews' => $reviews,
            'filters' => $request->only(['search', 'rating']),
        ]);
    }

    public function destroy(Review $review): RedirectResponse
    {
        $review->delete();

        return redirect()->route('admin.reviews.index')
            ->with('success', 'Ulasan berhasil dihapus.');
    }
}
