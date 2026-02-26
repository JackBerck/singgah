<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Review extends Model
{
    /** @use HasFactory<\Database\Factories\ReviewFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reviewable_id',
        'reviewable_type',
        'rating',
        'comment',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'rating'     => 'integer',
            'is_visible' => 'boolean',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** The parent model (Village, Attraction, Culinary, or Accommodation) */
    public function reviewable(): MorphTo
    {
        return $this->morphTo();
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────────

    public function scopeVisible($query)
    {
        return $query->where('is_visible', true);
    }
}
