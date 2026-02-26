<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Media extends Model
{
    /** @use HasFactory<\Database\Factories\MediaFactory> */
    use HasFactory;

    protected $fillable = [
        'mediable_id',
        'mediable_type',
        'file_path',
        'disk',
        'type',
        'alt_text',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────────

    /** The parent model (Village, VillageEvent, Attraction, Culinary, or Accommodation) */
    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────────

    public function isImage(): bool
    {
        return $this->type === 'image';
    }

    public function isVideo(): bool
    {
        return $this->type === 'video';
    }

    /** Returns the public URL for this media file */
    public function url(): string
    {
        return asset('storage/' . $this->file_path);
    }
}
