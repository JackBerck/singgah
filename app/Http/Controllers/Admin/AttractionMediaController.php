<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attraction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttractionMediaController extends Controller
{
    public function store(Request $request, Attraction $attraction): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,gif,mp4,webm', 'max:51200'],
        ]);

        $file  = $request->file('file');
        $dir   = 'attractions/' . $attraction->id;
        $path  = $file->store($dir, 'public');
        $type  = str_starts_with($file->getMimeType() ?? '', 'video/') ? 'video' : 'image';

        $media = $attraction->media()->create([
            'file_path' => $path,
            'disk'      => 'public',
            'type'      => $type,
            'alt_text'  => $file->getClientOriginalName(),
            'order'     => ($attraction->media()->max('order') ?? -1) + 1,
        ]);

        return response()->json([
            'id'  => $media->id,
            'url' => asset('storage/' . $path),
        ]);
    }
}
