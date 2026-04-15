<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    /** Map short type names to full model class strings */
    private const TYPE_MAP = [
        'village'       => \App\Models\Village::class,
        'event'         => \App\Models\VillageEvent::class,
        'attraction'    => \App\Models\Attraction::class,
        'culinary'      => \App\Models\Culinary::class,
        'accommodation' => \App\Models\Accommodation::class,
    ];

    /**
     * Toggle bookmark on/off.
     * POST /wishlist/toggle
     * Body: { type: 'village'|'event'|..., id: int }
     */
    public function toggle(Request $request): JsonResponse
    {
        $request->validate([
            'type' => ['required', 'string', 'in:' . implode(',', array_keys(self::TYPE_MAP))],
            'id'   => ['required', 'integer', 'min:1'],
        ]);

        /** @var \App\Models\User $user */
        $user      = auth()->user();
        $morphType = self::TYPE_MAP[$request->type];
        $morphId   = (int) $request->id;

        $existing = Wishlist::where('user_id', $user->id)
            ->where('wishlistable_type', $morphType)
            ->where('wishlistable_id', $morphId)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'wishlisted' => false,
                'message'    => 'Berhasil dihapus dari wishlist.',
            ]);
        }

        Wishlist::create([
            'user_id'          => $user->id,
            'wishlistable_type' => $morphType,
            'wishlistable_id'  => $morphId,
        ]);

        return response()->json([
            'wishlisted' => true,
            'message'    => 'Berhasil ditambahkan ke wishlist.',
        ]);
    }

    /**
     * Show all bookmarks for the authenticated user.
     * GET /profil/wishlist
     */
    public function index(): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $wishlists = Wishlist::where('user_id', $user->id)
            ->with([
                'wishlistable' => function ($morphTo) {
                    // eager load cover media for each type
                    $morphTo->morphWith([
                        \App\Models\Village::class       => ['media' => fn($q) => $q->orderBy('order')->limit(1)],
                        \App\Models\VillageEvent::class  => ['media' => fn($q) => $q->where('type', 'image')->limit(1), 'village:id,name,slug'],
                        \App\Models\Attraction::class    => ['media' => fn($q) => $q->orderBy('order')->limit(1), 'village:id,name,slug'],
                        \App\Models\Culinary::class      => ['media' => fn($q) => $q->orderBy('order')->limit(1), 'village:id,name,slug'],
                        \App\Models\Accommodation::class => ['media' => fn($q) => $q->orderBy('order')->limit(1), 'village:id,name,slug'],
                    ]);
                },
            ])
            ->latest()
            ->paginate(12)
            ->through(function (Wishlist $wl) {
            $entity    = $wl->wishlistable;
            $shortType = array_search($wl->wishlistable_type, self::TYPE_MAP);

            if (! $entity) {
                return null; // orphan — entity deleted
            }

            // Resolve cover image
            $cover = $entity->media->first()?->file_path;
            $coverUrl = $cover
                ? (str_starts_with($cover, 'http') ? $cover : "/storage/{$cover}")
                : null;

            // Resolve url
            $url = match ($shortType) {
                'village'       => "/desa/{$entity->slug}",
                'event'         => "/desa/{$entity->village->slug}/events/{$entity->slug}",
                'attraction'    => "/desa/{$entity->village->slug}/attractions/{$entity->slug}",
                'culinary'      => "/desa/{$entity->village->slug}/culinaries/{$entity->slug}",
                'accommodation' => "/desa/{$entity->village->slug}/accommodations/{$entity->slug}",
                default         => '#',
            };

            // Resolve location and description
            $location = $shortType === 'village' ? $entity->address : ($entity->location ?? null);
            $description = $entity->short_description ?? \Illuminate\Support\Str::limit($entity->description ?? '', 100);

            return [
                'id'          => $wl->id,
                'type'        => $shortType,
                'entity_id'   => $entity->id,
                'name'        => $entity->name,
                'cover'       => $coverUrl,
                'url'         => $url,
                'location'    => $location,
                'description' => $description,
                'created_at'  => $wl->created_at,
            ];
        });

        return Inertia::render('profil/wishlist', [
            'user'            => $user->only('id', 'name', 'email', 'role', 'avatar'),
            'wishlists'       => $wishlists,
            'wishlists_count' => $user->wishlists()->count(),
            'reviews_count'   => $user->reviews()->count(),
        ]);
    }
}
