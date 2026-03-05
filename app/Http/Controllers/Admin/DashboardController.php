<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Village;
use App\Models\VillageEvent;
use App\Models\Attraction;
use App\Models\Culinary;
use App\Models\Accommodation;
use App\Models\Review;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $userStats = [
            'total'   => User::count(),
            'admins'  => User::where('role', 'admin')->count(),
            'managers' => User::where('role', 'manager')->count(),
            'users'   => User::where('role', 'user')->count(),
        ];

        $villageStats = [
            'total'    => Village::count(),
            'verified' => Village::where('status', 'verified')->count(),
            'pending'  => Village::where('status', 'pending')->count(),
            'rejected' => Village::where('status', 'rejected')->count(),
            'featured' => Village::where('is_featured', true)->count(),
        ];

        $contentStats = [
            'events'         => VillageEvent::count(),
            'attractions'    => Attraction::count(),
            'culinaries'     => Culinary::count(),
            'accommodations' => Accommodation::count(),
            'reviews'        => Review::count(),
        ];

        $pendingVillages = Village::where('status', 'pending')
            ->with('manager:id,name,email')
            ->latest()
            ->take(8)
            ->get(['id', 'name', 'slug', 'manager_id', 'created_at']);

        $recentUsers = User::latest()
            ->take(5)
            ->get(['id', 'name', 'email', 'role', 'created_at']);

        return Inertia::render('admin/dashboard', [
            'userStats'       => $userStats,
            'villageStats'    => $villageStats,
            'contentStats'    => $contentStats,
            'pendingVillages' => $pendingVillages,
            'recentUsers'     => $recentUsers,
        ]);
    }
}
