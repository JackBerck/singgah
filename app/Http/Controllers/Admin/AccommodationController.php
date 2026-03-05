<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAccommodationRequest;
use App\Models\Accommodation;
use App\Models\Village;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AccommodationController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Accommodation::with('village:id,name,slug');

        if ($search = $request->get('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($villageId = $request->get('village_id')) {
            $query->where('village_id', $villageId);
        }

        $accommodations = $query->latest()->paginate(15)->withQueryString();
        $villages       = Village::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/accommodations/index', [
            'accommodations' => $accommodations,
            'villages'       => $villages,
            'filters'        => $request->only(['search', 'village_id']),
        ]);
    }

    public function edit(Accommodation $accommodation): Response
    {
        $accommodation->load(['village:id,name', 'media']);

        return Inertia::render('admin/accommodations/edit', [
            'accommodation' => $accommodation,
        ]);
    }

    public function update(UpdateAccommodationRequest $request, Accommodation $accommodation): RedirectResponse
    {
        $validated = $request->validated();
        unset($validated['files'], $validated['existing_media_ids']);

        $accommodation->update($validated);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store("accommodations/{$accommodation->id}", 'public');
                $type = str_starts_with($file->getMimeType() ?? '', 'video/') ? 'video' : 'image';
                $accommodation->media()->create([
                    'file_path' => $path,
                    'disk'      => 'public',
                    'type'      => $type,
                    'alt_text'  => $file->getClientOriginalName(),
                    'order'     => ($accommodation->media()->max('order') ?? -1) + 1,
                ]);
            }
        }

        $keepIds = $request->input('existing_media_ids', []);
        $accommodation->media()->whereNotIn('id', $keepIds)->each(function ($media) {
            Storage::disk($media->disk ?? 'public')->delete($media->file_path);
            $media->delete();
        });

        return redirect()->route('admin.accommodations.index')
            ->with('success', "Akomodasi \"{$accommodation->name}\" berhasil diperbarui.");
    }

    public function destroy(Accommodation $accommodation): RedirectResponse
    {
        $name = $accommodation->name;
        $accommodation->delete();

        return redirect()->route('admin.accommodations.index')
            ->with('success', "Akomodasi \"{$name}\" berhasil dihapus.");
    }
}
