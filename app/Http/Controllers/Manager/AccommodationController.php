<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Http\Requests\Manager\StoreAccommodationRequest;
use App\Http\Requests\Manager\UpdateAccommodationRequest;
use App\Models\Accommodation;
use App\Models\Village;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AccommodationController extends Controller
{
    private function village(Request $request): Village
    {
        return Village::where('manager_id', $request->user()->id)->firstOrFail();
    }

    public function index(Request $request): Response
    {
        $village = $this->village($request);
        return Inertia::render('manager/accommodations/index', [
            'village'        => $village,
            'accommodations' => $village->accommodations()->latest()->paginate(10),
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('manager/accommodations/create', [
            'village' => $this->village($request),
        ]);
    }

    public function store(StoreAccommodationRequest $request): RedirectResponse
    {
        $village = $this->village($request);
        $data    = $request->validated();
        $data['village_id'] = $village->id;
        $data['slug']       = Str::slug($data['name']) . '-' . now()->timestamp;

        $files = $request->file('files', []);
        unset($data['files'], $data['existing_media_ids']);

        $accommodation = Accommodation::create($data);

        // Upload files
        foreach ($files as $index => $file) {
            $dir = 'accommodations/' . $accommodation->id;
            $path = $file->store($dir, 'public');

            $accommodation->media()->create([
                'file_path' => $path,
                'disk'      => 'public',
                'type'      => str_starts_with($file->getMimeType() ?? '', 'video/') ? 'video' : 'image',
                'alt_text'  => $file->getClientOriginalName(),
                'order'     => $index,
            ]);
        }

        return redirect()->route('manager.accommodations.index')
            ->with('success', 'Akomodasi berhasil ditambahkan.');
    }

    public function edit(Request $request, Accommodation $accommodation): Response
    {
        abort_unless($accommodation->village_id === $this->village($request)->id, 403);

        $accommodation->load('media');

        return Inertia::render('manager/accommodations/edit', [
            'village'       => $this->village($request),
            'accommodation' => $accommodation,
        ]);
    }

    public function update(UpdateAccommodationRequest $request, Accommodation $accommodation): RedirectResponse
    {
        abort_unless($accommodation->village_id === $this->village($request)->id, 403);

        $data = $request->validated();
        $existingMediaIds = $data['existing_media_ids'] ?? [];
        $files = $request->file('files', []);
        unset($data['existing_media_ids'], $data['files']);

        $accommodation->update($data);

        // Delete media not in existing list
        $accommodation->media()->whereNotIn('id', $existingMediaIds)->each(function ($media) {
            \Storage::disk($media->disk ?? 'public')->delete($media->file_path);
            $media->delete();
        });

        // Upload new files
        $maxOrder = $accommodation->media()->max('order') ?? -1;
        foreach ($files as $index => $file) {
            $dir = 'accommodations/' . $accommodation->id;
            $path = $file->store($dir, 'public');

            $accommodation->media()->create([
                'file_path' => $path,
                'disk'      => 'public',
                'type'      => str_starts_with($file->getMimeType() ?? '', 'video/') ? 'video' : 'image',
                'alt_text'  => $file->getClientOriginalName(),
                'order'     => $maxOrder + $index + 1,
            ]);
        }

        return redirect()->route('manager.accommodations.index')
            ->with('success', 'Akomodasi berhasil diperbarui.');
    }

    public function destroy(Request $request, Accommodation $accommodation): RedirectResponse
    {
        abort_unless($accommodation->village_id === $this->village($request)->id, 403);
        $accommodation->delete();

        return redirect()->route('manager.accommodations.index')
            ->with('success', 'Akomodasi berhasil dihapus.');
    }
}
