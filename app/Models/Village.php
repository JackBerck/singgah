<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Village extends Model
{
    /** @use HasFactory<\Database\Factories\VillageFactory> */
    use HasFactory;

    protected $fillable = [
        'manager_id',
        'name',
        'slug',
        'short_description',
        'description',
        'address',
        'latitude',
        'longitude',
        'map_url',
        'status',
        'is_featured',
        'rejected_reason',
    ];

    protected function casts(): array
    {
        return [
            'latitude'    => 'float',
            'longitude'   => 'float',
            'is_featured' => 'boolean',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────────

    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function events(): HasMany
    {
        return $this->hasMany(VillageEvent::class)->orderBy('event_date');
    }

    public function attractions(): HasMany
    {
        return $this->hasMany(Attraction::class);
    }

    public function culinaries(): HasMany
    {
        return $this->hasMany(Culinary::class);
    }

    public function accommodations(): HasMany
    {
        return $this->hasMany(Accommodation::class);
    }

    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable')->orderBy('order');
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────────

    public function scopeVerified($query)
    {
        return $query->where('status', 'verified');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
