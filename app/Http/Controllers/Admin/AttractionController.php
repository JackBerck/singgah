<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAttractionRequest;
use App\Models\Attraction;
use App\Models\Village;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AttractionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Attraction::with('village:id,name,slug');

        if ($search = $request->get('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($villageId = $request->get('village_id')) {
            $query->where('village_id', $villageId);
        }

        $attractions = $query->latest()->paginate(15)->withQueryString();
        $villages    = Village::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/attractions/index', [
            'attractions' => $attractions,
            'villages'    => $villages,
            'filters'     => $request->only(['search', 'village_id']),
        ]);
    }

    public function edit(Attraction $attraction): Response
    {
        $attraction->load(['village:id,name', 'media']);

        return Inertia::render('admin/attractions/edit', [
            'attraction' => $attraction,
        ]);
    }

    public function update(UpdateAttractionRequest $request, Attraction $attraction): RedirectResponse
    {
        $validated = $request->validated();
        unset($validated['files'], $validated['existing_media_ids']);

        $attraction->update($validated);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store("attractions/{$attraction->id}", 'public');
                $type = str_starts_with($file->getMimeType() ?? '', 'video/') ? 'video' : 'image';
                $attraction->media()->create([
                    'file_path' => $path,
                    'disk'      => 'public',
                    'type'      => $type,
                    'alt_text'  => $file->getClientOriginalName(),
                    'order'     => ($attraction->media()->max('order') ?? -1) + 1,
                ]);
            }
        }

        $keepIds = $request->input('existing_media_ids', []);
        $attraction->media()->whereNotIn('id', $keepIds)->each(function ($media) {
            Storage::disk($media->disk ?? 'public')->delete($media->file_path);
            $media->delete();
        });

        return redirect()->route('admin.attractions.index')
            ->with('success', "Wisata \"{$attraction->name}\" berhasil diperbarui.");
    }

    public function destroy(Attraction $attraction): RedirectResponse
    {
        $name = $attraction->name;
        $attraction->delete();

        return redirect()->route('admin.attractions.index')
            ->with('success', "Wisata \"{$name}\" berhasil dihapus.");
    }
}
