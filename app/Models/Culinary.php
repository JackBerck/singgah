<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Culinary extends Model
{
    /** @use HasFactory<\Database\Factories\CulinaryFactory> */
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
}
