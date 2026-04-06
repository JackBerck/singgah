<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserProfileRequest;
use App\Http\Requests\UpdateUserPasswordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class UserProfileController extends Controller
{
    /** GET /profil — Informasi Akun */
    public function show(): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        return Inertia::render('profil/index', [
            'user'           => $user->only('id', 'name', 'email', 'phone', 'address', 'avatar', 'role'),
            'wishlists_count' => $user->wishlists()->count(),
            'reviews_count'  => $user->reviews()->count(),
        ]);
    }

    /** GET /profil/keamanan — Keamanan */
    public function keamanan(): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        return Inertia::render('profil/keamanan', [
            'user'           => $user->only('id', 'name', 'email', 'role', 'avatar'),
            'wishlists_count' => $user->wishlists()->count(),
            'reviews_count'  => $user->reviews()->count(),
        ]);
    }

    /** GET /profil/ulasan — Ulasan Saya */
    public function ulasan(): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user()->load([
            'reviews' => fn($q) => $q->with(['reviewable'])->visible()->latest()->limit(50),
        ]);

        return Inertia::render('profil/ulasan', [
            'user'           => $user->only('id', 'name', 'email', 'role', 'avatar'),
            'reviews'        => $user->reviews,
            'wishlists_count' => $user->wishlists()->count(),
            'reviews_count'  => $user->reviews()->count(),
        ]);
    }

    /** POST /profil — Update account info */
    public function update(UpdateUserProfileRequest $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        unset($data['avatar_file']);

        $user->update(array_filter($data, fn($v) => $v !== null));

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    /** PUT /profil/password — Update password */
    public function updatePassword(UpdateUserPasswordRequest $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        $data = $request->validated();

        if (! Hash::check($data['current_password'], $user->password)) {
            return back()->withErrors(['current_password' => 'Kata sandi saat ini tidak sesuai.']);
        }

        $user->update(['password' => Hash::make($data['password'])]);

        return back()->with('success', 'Kata sandi berhasil diubah.');
    }
}
