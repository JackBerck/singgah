<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureVillageManager
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->isManager()) {
            return redirect()->route('home')
                ->with('error', 'Akses ditolak. Halaman ini hanya untuk Pengelola Desa.');
        }

        return $next($request);
    }
}
