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
    public function show(): Response
    {
        $user = auth()->user()->load([
            'reviews' => fn($q) => $q->with(['reviewable'])->latest()->limit(50),
        ]);

        return Inertia::render('profil/index', [
            'user' => $user,
        ]);
    }

    public function update(UpdateUserProfileRequest $request): RedirectResponse
    {
        $user = auth()->user();
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            // Delete old avatar
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        unset($data['avatar_file']); // ensure raw file not sent

        $user->update(array_filter($data, fn($v) => $v !== null));

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    public function updatePassword(UpdateUserPasswordRequest $request): RedirectResponse
    {
        $user = auth()->user();
        $data = $request->validated();

        if (!Hash::check($data['current_password'], $user->password)) {
            return back()->withErrors(['current_password' => 'Kata sandi saat ini tidak sesuai.']);
        }

        $user->update(['password' => Hash::make($data['password'])]);

        return back()->with('success', 'Kata sandi berhasil diubah.');
    }
}
