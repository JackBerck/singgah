<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;

class VillageEvent extends Model
{
    /** @use HasFactory<\Database\Factories\VillageEventFactory> */
    use HasFactory;

    protected $fillable = [
        'village_id',
        'name',
        'slug',
        'description',
        'location',
        'event_date',
        'end_date',
        'contact_info',
        'is_featured',
        'map_url',
    ];

    protected function casts(): array
    {
        return [
            'event_date'  => 'datetime',
            'end_date'    => 'datetime',
            'is_featured' => 'boolean',
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

    // ─── Scopes ──────────────────────────────────────────────────────────────────

    public function scopeUpcoming($query)
    {
        return $query->where('event_date', '>=', now());
    }
}
