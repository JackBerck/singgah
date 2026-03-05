<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role = $request->get('role')) {
            $query->where('role', $role);
        }

        $users = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/users/index', [
            'users'   => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('admin/users/edit', [
            'user' => $user->only(['id', 'name', 'email', 'role', 'avatar', 'phone', 'address', 'created_at']),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id && $request->role !== 'admin') {
            return back()->with('error', 'Tidak dapat mengubah role akun Anda sendiri.');
        }

        $user->update($request->only(['name', 'role']));

        return redirect()->route('admin.users.index')
            ->with('success', "Pengguna {$user->name} berhasil diperbarui.");
    }

    public function updatePassword(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'password'              => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required', 'string'],
        ], [
            'password.required'              => 'Password baru wajib diisi.',
            'password.min'                   => 'Password minimal 8 karakter.',
            'password.confirmed'             => 'Konfirmasi password tidak cocok.',
            'password_confirmation.required' => 'Konfirmasi password wajib diisi.',
        ]);

        $user->update(['password' => Hash::make($request->password)]);

        return back()->with('success', "Password pengguna {$user->name} berhasil diperbarui.");
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'Tidak dapat menghapus akun Anda sendiri.');
        }

        if ($user->isAdmin()) {
            return back()->with('error', 'Tidak dapat menghapus akun Administrator lain.');
        }

        $name = $user->name;
        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', "Pengguna {$name} berhasil dihapus.");
    }
}
