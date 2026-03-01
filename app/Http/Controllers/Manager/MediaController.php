<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Village;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    /**
     * Delete media that belongs to any entity owned by the manager's village
     */
    public function destroy(Request $request, Media $media): JsonResponse
    {
        $village = Village::where('manager_id', $request->user()->id)->firstOrFail();

        // Check if media belongs to village or any of its entities
        $allowedTypes = [
            \App\Models\Village::class,
            \App\Models\VillageEvent::class,
            \App\Models\Attraction::class,
            \App\Models\Culinary::class,
            \App\Models\Accommodation::class,
        ];

        abort_unless(in_array($media->mediable_type, $allowedTypes), 403, 'Invalid media type');

        // For village media, ensure it's the manager's village
        if ($media->mediable_type === \App\Models\Village::class) {
            abort_unless($media->mediable_id === $village->id, 403);
        } else {
            // For entity media, ensure the entity belongs to manager's village
            $entity = $media->mediable;
            abort_unless($entity && $entity->village_id === $village->id, 403);
        }

        Storage::disk($media->disk ?? 'public')->delete($media->file_path);
        $media->delete();

        return response()->json(['message' => 'Media berhasil dihapus.']);
    }
}
