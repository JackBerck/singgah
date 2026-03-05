<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterManagerRequest;
use App\Models\User;
use App\Models\Village;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class RegisteredManagerController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/register-manager');
    }

    public function store(RegisterManagerRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'phone'    => $data['phone'] ?? null,
            'role'     => 'manager',
        ]);

        event(new Registered($user));

        // Create pending village
        $villageName = $data['village_name'];
        $slug = Str::slug($villageName);

        // Ensure unique slug
        $original = $slug;
        $count = 1;
        while (Village::where('slug', $slug)->exists()) {
            $slug = "{$original}-{$count}";
            $count++;
        }

        Village::create([
            'manager_id'        => $user->id,
            'name'              => $villageName,
            'slug'              => $slug,
            'short_description' => $data['village_short_description'] ?? null,
            'address'           => $data['village_address'] ?? null,
            'status'            => 'pending',
        ]);

        Auth::login($user);

        return redirect()->route('register.manager.success');
    }

    public function success(): Response
    {
        return Inertia::render('auth/register-manager-success');
    }
}
