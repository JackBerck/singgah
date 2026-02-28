<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Http\Requests\Manager\StoreEventRequest;
use App\Http\Requests\Manager\UpdateEventRequest;
use App\Models\Village;
use App\Models\VillageEvent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    private function village(Request $request): Village
    {
        return Village::where('manager_id', $request->user()->id)->firstOrFail();
    }

    public function index(Request $request): Response
    {
        $village = $this->village($request);
        $events = $village->events()
            ->latest('event_date')
            ->paginate(10);

        return Inertia::render('manager/events/index', [
            'village' => $village,
            'events'  => $events,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('manager/events/create', [
            'village' => $this->village($request),
        ]);
    }

    public function store(StoreEventRequest $request): RedirectResponse
    {
        $village = $this->village($request);
        $data    = $request->validated();
        $data['village_id'] = $village->id;
        $data['slug']       = Str::slug($data['name']) . '-' . now()->timestamp;

        VillageEvent::create($data);

        return redirect()->route('manager.events.index')
            ->with('success', 'Acara berhasil ditambahkan.');
    }

    public function edit(Request $request, VillageEvent $event): Response
    {
        abort_unless($event->village_id === $this->village($request)->id, 403);

        return Inertia::render('manager/events/edit', [
            'village' => $this->village($request),
            'event'   => $event,
        ]);
    }

    public function update(UpdateEventRequest $request, VillageEvent $event): RedirectResponse
    {
        abort_unless($event->village_id === $this->village($request)->id, 403);
        $event->update($request->validated());

        return redirect()->route('manager.events.index')
            ->with('success', 'Acara berhasil diperbarui.');
    }

    public function destroy(Request $request, VillageEvent $event): RedirectResponse
    {
        abort_unless($event->village_id === $this->village($request)->id, 403);
        $event->delete();

        return redirect()->route('manager.events.index')
            ->with('success', 'Acara berhasil dihapus.');
    }
}
