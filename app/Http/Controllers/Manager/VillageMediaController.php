<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Village;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VillageMediaController extends Controller
{
    private function getVillage(Request $request): Village
    {
        return Village::where('manager_id', $request->user()->id)->firstOrFail();
    }

    public function store(Request $request): JsonResponse|RedirectResponse
    {
        $request->validate([
            'file'  => ['required', 'file', 'image', 'max:5120', 'mimes:jpg,jpeg,png,webp'],
            'order' => ['nullable', 'integer', 'min:0'],
        ]);

        $village = $this->getVillage($request);

        $file = $request->file('file');
        $dir  = 'villages/' . $village->slug;
        $path = $file->store($dir, 'public');

        $media = $village->media()->create([
            'file_path' => $path,
            'disk'      => 'public',
            'type'      => 'image',
            'alt_text'  => $file->getClientOriginalName(),
            'order'     => $request->input('order', ($village->media()->max('order') ?? -1) + 1),
        ]);

        return response()->json([
            'id'  => $media->id,
            'url' => asset('storage/' . $path),
        ]);
    }

    public function destroy(Request $request, Media $media): RedirectResponse
    {
        $village = $this->getVillage($request);

        // Ensure this media belongs to the manager's village
        abort_unless(
            $media->mediable_id === $village->id && $media->mediable_type === Village::class,
            403
        );

        Storage::disk('public')->delete($media->file_path);
        $media->delete();

        return back()->with('success', 'Foto berhasil dihapus.');
    }
}
