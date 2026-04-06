<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Wishlist extends Model
{
    protected $fillable = [
        'user_id',
        'wishlistable_id',
        'wishlistable_type',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** The bookmarked model (Village, VillageEvent, Attraction, Culinary, Accommodation) */
    public function wishlistable(): MorphTo
    {
        return $this->morphTo();
    }
}
