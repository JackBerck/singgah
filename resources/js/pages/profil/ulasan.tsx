import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Star, Trash2 } from 'lucide-react';
import StarRating from '@/components/public/StarRating';
import ProfileLayout from '@/layouts/ProfileLayout';

interface Review {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    reviewable: {
        id: number;
        name: string;
        slug?: string;
    } | null;
    reviewable_type: string;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
}

interface Props {
    user: AuthUser;
    reviews: Review[];
    wishlists_count: number;
    reviews_count: number;
}

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

const typeLabel: Record<string, string> = {
    'App\\Models\\Village': '🏡 Desa',
    'App\\Models\\Attraction': '🗺️ Wisata',
    'App\\Models\\Culinary': '🍜 Kuliner',
    'App\\Models\\Accommodation': '🏠 Akomodasi',
};

export default function Ulasan({ user, reviews, wishlists_count, reviews_count }: Props) {
    const deleteReview = (id: number) => {
        router.delete(`/reviews/${id}`, {
            preserveScroll: true,
            onSuccess: () => toast.success('Ulasan dihapus.'),
        });
    };

    return (
        <ProfileLayout
            user={user}
            activeTab="ulasan"
            wishlistsCount={wishlists_count}
            reviewsCount={reviews_count}
        >
            <Head title="Ulasan Saya — Singgah" />

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-5 font-semibold text-gray-800">
                    Ulasan Saya
                </h2>
                {reviews.length === 0 ? (
                    <div
                        className="rounded-2xl py-12 text-center"
                        style={{
                            background: 'var(--singgah-green-50)',
                        }}
                    >
                        <Star
                            className="mx-auto mb-3 h-10 w-10 opacity-30"
                            style={{
                                color: 'var(--singgah-green-600)',
                            }}
                        />
                        <p className="text-sm text-gray-500">
                            Anda belum pernah menulis ulasan.
                        </p>
                        <Link
                            href="/explore"
                            className="btn-primary mt-4 inline-flex"
                        >
                            Jelajahi Desa
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((r) => (
                            <div
                                key={r.id}
                                className="review-item rounded-2xl border border-gray-100 p-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {r.reviewable?.name ??
                                                'Konten Dihapus'}
                                        </p>
                                        <p className="mt-0.5 text-xs text-gray-500">
                                            {typeLabel[r.reviewable_type] ??
                                                r.reviewable_type.replace(
                                                    'App\\Models\\',
                                                    '',
                                                )}{' '}
                                            · {fmtDate(r.created_at)}
                                        </p>
                                        <div className="mt-1.5">
                                            <StarRating
                                                value={r.rating}
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteReview(r.id)}
                                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-100 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                        title="Hapus ulasan"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                {r.comment && (
                                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                        {r.comment}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ProfileLayout>
    );
}
