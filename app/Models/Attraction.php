<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Attraction extends Model
{
    /** @use HasFactory<\Database\Factories\AttractionFactory> */
    use HasFactory;

    protected $fillable = [
        'village_id',
        'name',
        'slug',
        'description',
        'price_min',
        'price_max',
        'location',
        'contact_info',
        'open_time',
        'close_time',
        'map_url',
    ];

    protected function casts(): array
    {
        return [
            'price_min' => 'float',
            'price_max' => 'float',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────────

    public function village(): BelongsTo
    {
        return $this->belongsTo(Village::class);
    }

    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable')->orderBy('order');
    }

    public function wishlists(): MorphMany
    {
        return $this->morphMany(Wishlist::class, 'wishlistable');
    }
}
