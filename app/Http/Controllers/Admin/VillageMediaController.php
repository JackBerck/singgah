<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Village;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VillageMediaController extends Controller
{
    public function store(Request $request, Village $village): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
        ]);

        $file  = $request->file('file');
        $dir   = 'villages/' . $village->id;
        $path  = $file->store($dir, 'public');

        $media = $village->media()->create([
            'file_path' => $path,
            'disk'      => 'public',
            'type'      => 'image',
            'alt_text'  => $file->getClientOriginalName(),
            'order'     => ($village->media()->max('order') ?? -1) + 1,
        ]);

        return response()->json([
            'id'  => $media->id,
            'url' => asset('storage/' . $path),
        ]);
    }
}
