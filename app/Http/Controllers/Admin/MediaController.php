<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    /**
     * Admin can delete any media belonging to any entity.
     */
    public function destroy(Media $media): JsonResponse
    {
        Storage::disk($media->disk ?? 'public')->delete($media->file_path);
        $media->delete();

        return response()->json(['message' => 'Media berhasil dihapus.']);
    }
}
