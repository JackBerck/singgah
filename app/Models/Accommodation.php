<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;

class Accommodation extends Model
{
    /** @use HasFactory<\Database\Factories\AccommodationFactory> */
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

    protected static function booted(): void
    {
        static::saving(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name);
            }
        });
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
