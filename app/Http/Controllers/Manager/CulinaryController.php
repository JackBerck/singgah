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
        Culinary::create($data);

        return redirect()->route('manager.culinaries.index')
            ->with('success', 'Kuliner berhasil ditambahkan.');
    }

    public function edit(Request $request, Culinary $culinary): Response
    {
        abort_unless($culinary->village_id === $this->village($request)->id, 403);
        return Inertia::render('manager/culinaries/edit', [
            'village'  => $this->village($request),
            'culinary' => $culinary,
        ]);
    }

    public function update(UpdateCulinaryRequest $request, Culinary $culinary): RedirectResponse
    {
        abort_unless($culinary->village_id === $this->village($request)->id, 403);
        $culinary->update($request->validated());

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
