<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateCulinaryRequest;
use App\Models\Culinary;
use App\Models\Village;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CulinaryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Culinary::with('village:id,name,slug');

        if ($search = $request->get('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($villageId = $request->get('village_id')) {
            $query->where('village_id', $villageId);
        }

        $culinaries = $query->latest()->paginate(15)->withQueryString();
        $villages   = Village::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/culinaries/index', [
            'culinaries' => $culinaries,
            'villages'   => $villages,
            'filters'    => $request->only(['search', 'village_id']),
        ]);
    }

    public function edit(Culinary $culinary): Response
    {
        $culinary->load(['village:id,name', 'media']);

        return Inertia::render('admin/culinaries/edit', [
            'culinary' => $culinary,
        ]);
    }

    public function update(UpdateCulinaryRequest $request, Culinary $culinary): RedirectResponse
    {
        $validated = $request->validated();
        unset($validated['files'], $validated['existing_media_ids']);

        $culinary->update($validated);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store("culinaries/{$culinary->id}", 'public');
                $type = str_starts_with($file->getMimeType() ?? '', 'video/') ? 'video' : 'image';
                $culinary->media()->create([
                    'file_path' => $path,
                    'disk'      => 'public',
                    'type'      => $type,
                    'alt_text'  => $file->getClientOriginalName(),
                    'order'     => ($culinary->media()->max('order') ?? -1) + 1,
                ]);
            }
        }

        $keepIds = $request->input('existing_media_ids', []);
        $culinary->media()->whereNotIn('id', $keepIds)->each(function ($media) {
            Storage::disk($media->disk ?? 'public')->delete($media->file_path);
            $media->delete();
        });

        return redirect()->route('admin.culinaries.index')
            ->with('success', "Kuliner \"{$culinary->name}\" berhasil diperbarui.");
    }

    public function destroy(Culinary $culinary): RedirectResponse
    {
        $name = $culinary->name;
        $culinary->delete();

        return redirect()->route('admin.culinaries.index')
            ->with('success', "Kuliner \"{$name}\" berhasil dihapus.");
    }
}
