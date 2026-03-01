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

        $mediaIds = $data['media_ids'] ?? [];
        unset($data['media_ids']);

        $attraction = Attraction::create($data);

        // Attach media from village to attraction
        if (!empty($mediaIds)) {
            \App\Models\Media::whereIn('id', $mediaIds)
                ->where('mediable_type', \App\Models\Village::class)
                ->where('mediable_id', $village->id)
                ->update([
                    'mediable_type' => Attraction::class,
                    'mediable_id'   => $attraction->id,
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
        $mediaIds = $data['media_ids'] ?? [];
        unset($data['media_ids']);

        $attraction->update($data);

        // Attach new media from village to attraction
        if (!empty($mediaIds)) {
            $village = $this->village($request);
            \App\Models\Media::whereIn('id', $mediaIds)
                ->where('mediable_type', \App\Models\Village::class)
                ->where('mediable_id', $village->id)
                ->update([
                    'mediable_type' => Attraction::class,
                    'mediable_id'   => $attraction->id,
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
