<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VillageEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventMediaController extends Controller
{
    public function store(Request $request, VillageEvent $event): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,gif,mp4,webm', 'max:51200'],
        ]);

        $file  = $request->file('file');
        $dir   = 'events/' . $event->id;
        $path  = $file->store($dir, 'public');
        $type  = str_starts_with($file->getMimeType() ?? '', 'video/') ? 'video' : 'image';

        $media = $event->media()->create([
            'file_path' => $path,
            'disk'      => 'public',
            'type'      => $type,
            'alt_text'  => $file->getClientOriginalName(),
            'order'     => ($event->media()->max('order') ?? -1) + 1,
        ]);

        return response()->json([
            'id'  => $media->id,
            'url' => asset('storage/' . $path),
        ]);
    }
}
