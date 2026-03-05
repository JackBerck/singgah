<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectVillageRequest;
use App\Http\Requests\Admin\UpdateVillageRequest;
use App\Models\Village;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VillageController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Village::with('manager:id,name,email')
            ->withCount(['events', 'attractions', 'culinaries', 'accommodations', 'reviews']);

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $villages = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/villages/index', [
            'villages' => $villages,
            'filters'  => $request->only(['search', 'status']),
        ]);
    }

    public function edit(Village $village): Response
    {
        $village->load(['manager:id,name,email', 'media']);

        return Inertia::render('admin/villages/edit', [
            'village' => $village,
        ]);
    }

    public function update(UpdateVillageRequest $request, Village $village): RedirectResponse
    {
        $validated = $request->validated();
        unset($validated['files'], $validated['existing_media_ids']);

        $village->update($validated);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store("villages/{$village->id}", 'public');
                $village->media()->create([
                    'file_path' => $path,
                    'disk'      => 'public',
                    'type'      => 'image',
                    'alt_text'  => $file->getClientOriginalName(),
                    'order'     => ($village->media()->max('order') ?? -1) + 1,
                ]);
            }
        }

        $keepIds = $request->input('existing_media_ids', []);
        $village->media()->whereNotIn('id', $keepIds)->each(function ($media) {
            Storage::disk($media->disk ?? 'public')->delete($media->file_path);
            $media->delete();
        });

        return redirect()->route('admin.villages.index')
            ->with('success', "Desa {$village->name} berhasil diperbarui.");
    }

    public function verify(Village $village): RedirectResponse
    {
        $village->update([
            'status'          => 'verified',
            'rejected_reason' => null,
        ]);

        return back()->with('success', "Desa {$village->name} berhasil diverifikasi.");
    }

    public function reject(RejectVillageRequest $request, Village $village): RedirectResponse
    {
        $village->update([
            'status'          => 'rejected',
            'rejected_reason' => $request->rejected_reason,
        ]);

        return back()->with('success', "Desa {$village->name} telah ditolak.");
    }

    public function toggleFeatured(Village $village): RedirectResponse
    {
        $village->update(['is_featured' => ! $village->is_featured]);

        $label = $village->is_featured ? 'ditandai unggulan' : 'dihapus dari unggulan';

        return back()->with('success', "Desa {$village->name} berhasil {$label}.");
    }

    public function destroy(Village $village): RedirectResponse
    {
        $name = $village->name;

        $village->media()->each(function ($media) {
            Storage::disk($media->disk ?? 'public')->delete($media->file_path);
            $media->delete();
        });

        $village->delete();

        return redirect()->route('admin.villages.index')
            ->with('success', "Desa {$name} berhasil dihapus.");
    }
}
