<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Http\Requests\Manager\UpdateVillageRequest;
use App\Models\Village;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class VillageController extends Controller
{
    private function getVillage(Request $request): Village
    {
        return Village::where('manager_id', $request->user()->id)
            ->with(['media'])
            ->firstOrFail();
    }

    public function edit(Request $request): Response
    {
        $village = $this->getVillage($request);

        return Inertia::render('manager/village/edit', [
            'village' => $village,
        ]);
    }

    public function update(UpdateVillageRequest $request): RedirectResponse
    {
        $village = $this->getVillage($request);

        $data = $request->validated();

        // Auto-generate slug only if name changed
        if ($data['name'] !== $village->name) {
            $slug = Str::slug($data['name']);
            $count = 1;
            $originalSlug = $slug;
            while (Village::where('slug', $slug)->where('id', '!=', $village->id)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }
            $data['slug'] = $slug;
        }

        $village->update($data);

        return redirect()->route('manager.village.edit')
            ->with('success', 'Profil desa berhasil diperbarui.');
    }
}
