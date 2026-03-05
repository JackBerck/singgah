<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateEventRequest;
use App\Models\VillageEvent;
use App\Models\Village;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request): Response
    {
        $query = VillageEvent::with('village:id,name,slug');

        if ($search = $request->get('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($villageId = $request->get('village_id')) {
            $query->where('village_id', $villageId);
        }

        $events   = $query->latest('event_date')->paginate(15)->withQueryString();
        $villages = Village::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/events/index', [
            'events'   => $events,
            'villages' => $villages,
            'filters'  => $request->only(['search', 'village_id']),
        ]);
    }

    public function edit(VillageEvent $event): Response
    {
        $event->load(['village:id,name', 'media']);

        return Inertia::render('admin/events/edit', [
            'event' => $event,
        ]);
    }

    public function update(UpdateEventRequest $request, VillageEvent $event): RedirectResponse
    {
        $validated = $request->validated();
        unset($validated['files'], $validated['existing_media_ids']);

        $event->update($validated);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store("events/{$event->id}", 'public');
                $type = str_starts_with($file->getMimeType() ?? '', 'video/') ? 'video' : 'image';
                $event->media()->create([
                    'file_path' => $path,
                    'disk'      => 'public',
                    'type'      => $type,
                    'alt_text'  => $file->getClientOriginalName(),
                    'order'     => ($event->media()->max('order') ?? -1) + 1,
                ]);
            }
        }

        $keepIds = $request->input('existing_media_ids', []);
        $event->media()->whereNotIn('id', $keepIds)->each(function ($media) {
            Storage::disk($media->disk ?? 'public')->delete($media->file_path);
            $media->delete();
        });

        return redirect()->route('admin.events.index')
            ->with('success', "Acara \"{$event->name}\" berhasil diperbarui.");
    }

    public function destroy(VillageEvent $event): RedirectResponse
    {
        $name = $event->name;
        $event->delete();

        return redirect()->route('admin.events.index')
            ->with('success', "Acara \"{$name}\" berhasil dihapus.");
    }
}
