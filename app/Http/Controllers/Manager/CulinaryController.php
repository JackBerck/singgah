<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Http\Requests\Manager\StoreCulinaryRequest;
use App\Http\Requests\Manager\UpdateCulinaryRequest;
use App\Models\Culinary;
use App\Models\Village;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CulinaryController extends Controller
{
    private function village(Request $request): Village
    {
        return Village::where('manager_id', $request->user()->id)->firstOrFail();
    }

    public function index(Request $request): Response
    {
        $village = $this->village($request);
        return Inertia::render('manager/culinaries/index', [
            'village'    => $village,
            'culinaries' => $village->culinaries()->latest()->paginate(10),
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('manager/culinaries/create', [
            'village' => $this->village($request),
        ]);
    }

    public function store(StoreCulinaryRequest $request): RedirectResponse
    {
        $village = $this->village($request);
        $data    = $request->validated();
        $data['village_id'] = $village->id;
        $data['slug']       = Str::slug($data['name']) . '-' . now()->timestamp;

        $files = $request->file('files', []);
        unset($data['files'], $data['existing_media_ids']);

        $culinary = Culinary::create($data);

        // Upload files
        foreach ($files as $index => $file) {
            $dir = 'culinaries/' . $culinary->id;
            $path = $file->store($dir, 'public');

            $culinary->media()->create([
                'file_path' => $path,
                'disk'      => 'public',
                'type'      => str_starts_with($file->getMimeType() ?? '', 'video/') ? 'video' : 'image',
                'alt_text'  => $file->getClientOriginalName(),
                'order'     => $index,
            ]);
        }

        return redirect()->route('manager.culinaries.index')
            ->with('success', 'Kuliner berhasil ditambahkan.');
    }

    public function edit(Request $request, Culinary $culinary): Response
    {
        abort_unless($culinary->village_id === $this->village($request)->id, 403);

        $culinary->load('media');

        return Inertia::render('manager/culinaries/edit', [
            'village'  => $this->village($request),
            'culinary' => $culinary,
        ]);
    }

    public function update(UpdateCulinaryRequest $request, Culinary $culinary): RedirectResponse
    {
        abort_unless($culinary->village_id === $this->village($request)->id, 403);

        $data = $request->validated();
        $existingMediaIds = $data['existing_media_ids'] ?? [];
        $files = $request->file('files', []);
        unset($data['existing_media_ids'], $data['files']);

        $culinary->update($data);

        // Delete media not in existing list
        $culinary->media()->whereNotIn('id', $existingMediaIds)->each(function ($media) {
            \Storage::disk($media->disk ?? 'public')->delete($media->file_path);
            $media->delete();
        });

        // Upload new files
        $maxOrder = $culinary->media()->max('order') ?? -1;
        foreach ($files as $index => $file) {
            $dir = 'culinaries/' . $culinary->id;
            $path = $file->store($dir, 'public');

            $culinary->media()->create([
                'file_path' => $path,
                'disk'      => 'public',
                'type'      => str_starts_with($file->getMimeType() ?? '', 'video/') ? 'video' : 'image',
                'alt_text'  => $file->getClientOriginalName(),
                'order'     => $maxOrder + $index + 1,
            ]);
        }

        return redirect()->route('manager.culinaries.index')
            ->with('success', 'Kuliner berhasil diperbarui.');
    }

    public function destroy(Request $request, Culinary $culinary): RedirectResponse
    {
        abort_unless($culinary->village_id === $this->village($request)->id, 403);
        $culinary->delete();

        return redirect()->route('manager.culinaries.index')
            ->with('success', 'Kuliner berhasil dihapus.');
    }
}
