<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreReviewRequest;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Determine reviewable model
        $type = match ($data['reviewable_type']) {
            'village'       => \App\Models\Village::class,
            'attraction'    => \App\Models\Attraction::class,
            'culinary'      => \App\Models\Culinary::class,
            'accommodation' => \App\Models\Accommodation::class,
            default         => abort(422, 'Tipe ulasan tidak valid.'),
        };

        $reviewable = $type::findOrFail($data['reviewable_id']);

        // Check unique: 1 user per reviewable
        $exists = Review::where('user_id', auth()->id())
            ->where('reviewable_type', $type)
            ->where('reviewable_id', $reviewable->id)
            ->exists();

        if ($exists) {
            return back()->with('error', 'Anda sudah memberikan ulasan untuk ini.');
        }

        $reviewable->reviews()->create([
            'user_id'    => auth()->id(),
            'rating'     => $data['rating'],
            'comment'    => $data['comment'] ?? null,
            'is_visible' => true,
        ]);

        return back()->with('success', 'Ulasan berhasil disimpan.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $review = Review::findOrFail($id);

        // Only owner or admin can delete
        if ($review->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
            abort(403);
        }

        $review->delete();

        return back()->with('success', 'Ulasan berhasil dihapus.');
    }
}
