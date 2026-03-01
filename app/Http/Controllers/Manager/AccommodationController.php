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

        $mediaIds = $data['media_ids'] ?? [];
        unset($data['media_ids']);

        $accommodation = Accommodation::create($data);

        // Attach media from village to accommodation
        if (!empty($mediaIds)) {
            \App\Models\Media::whereIn('id', $mediaIds)
                ->where('mediable_type', \App\Models\Village::class)
                ->where('mediable_id', $village->id)
                ->update([
                    'mediable_type' => Accommodation::class,
                    'mediable_id'   => $accommodation->id,
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
        $mediaIds = $data['media_ids'] ?? [];
        unset($data['media_ids']);

        $accommodation->update($data);

        // Attach new media from village to accommodation
        if (!empty($mediaIds)) {
            $village = $this->village($request);
            \App\Models\Media::whereIn('id', $mediaIds)
                ->where('mediable_type', \App\Models\Village::class)
                ->where('mediable_id', $village->id)
                ->update([
                    'mediable_type' => Accommodation::class,
                    'mediable_id'   => $accommodation->id,
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
