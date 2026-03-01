<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Http\Requests\Manager\StoreAttractionRequest;
use App\Http\Requests\Manager\UpdateAttractionRequest;
use App\Models\Attraction;
use App\Models\Village;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AttractionController extends Controller
{
    private function village(Request $request): Village
    {
        return Village::where('manager_id', $request->user()->id)->firstOrFail();
    }

    public function index(Request $request): Response
    {
        $village = $this->village($request);
        return Inertia::render('manager/attractions/index', [
            'village'     => $village,
            'attractions' => $village->attractions()->latest()->paginate(10),
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('manager/attractions/create', [
            'village' => $this->village($request),
        ]);
    }

    public function store(StoreAttractionRequest $request): RedirectResponse
    {
        $village = $this->village($request);
        $data    = $request->validated();
        $data['village_id'] = $village->id;
        $data['slug']       = Str::slug($data['name']) . '-' . now()->timestamp;

        $files = $request->file('files', []);
        unset($data['files'], $data['existing_media_ids']);

        $attraction = Attraction::create($data);

        // Handle file uploads
        foreach ($files as $index => $file) {
            $dir = 'attractions/' . $attraction->id;
            $path = $file->store($dir, 'public');

            $attraction->media()->create([
                'file_path' => $path,
                'disk'      => 'public',
                'type'      => str_starts_with($file->getMimeType() ?? '', 'video/') ? 'video' : 'image',
                'alt_text'  => $file->getClientOriginalName(),
                'order'     => $index,
            ]);
        }

        return redirect()->route('manager.attractions.index')
            ->with('success', 'Wisata/Atraksi berhasil ditambahkan.');
    }

    public function edit(Request $request, Attraction $attraction): Response
    {
        abort_unless($attraction->village_id === $this->village($request)->id, 403);

        $attraction->load('media');

        return Inertia::render('manager/attractions/edit', [
            'village'    => $this->village($request),
            'attraction' => $attraction,
        ]);
    }

    public function update(UpdateAttractionRequest $request, Attraction $attraction): RedirectResponse
    {
        abort_unless($attraction->village_id === $this->village($request)->id, 403);

        $data = $request->validated();
        $existingMediaIds = $data['existing_media_ids'] ?? [];
        $files = $request->file('files', []);
        unset($data['existing_media_ids'], $data['files']);

        $attraction->update($data);

        // Delete media not in existing list
        $attraction->media()->whereNotIn('id', $existingMediaIds)->each(function ($media) {
            \Storage::disk($media->disk ?? 'public')->delete($media->file_path);
            $media->delete();
        });

        // Upload new files
        $maxOrder = $attraction->media()->max('order') ?? -1;
        foreach ($files as $index => $file) {
            $dir = 'attractions/' . $attraction->id;
            $path = $file->store($dir, 'public');

            $attraction->media()->create([
                'file_path' => $path,
                'disk'      => 'public',
                'type'      => str_starts_with($file->getMimeType() ?? '', 'video/') ? 'video' : 'image',
                'alt_text'  => $file->getClientOriginalName(),
                'order'     => $maxOrder + $index + 1,
            ]);
        }

        return redirect()->route('manager.attractions.index')
            ->with('success', 'Wisata/Atraksi berhasil diperbarui.');
    }

    public function destroy(Request $request, Attraction $attraction): RedirectResponse
    {
        abort_unless($attraction->village_id === $this->village($request)->id, 403);
        $attraction->delete();

        return redirect()->route('manager.attractions.index')
            ->with('success', 'Wisata/Atraksi berhasil dihapus.');
    }
}
