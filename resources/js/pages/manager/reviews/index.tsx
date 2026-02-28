import ManagerLayout from '@/layouts/ManagerLayout';
import PageHeader from '@/components/manager/PageHeader';
import { Star } from 'lucide-react';

interface Village {
    id: number;
    name: string;
    slug: string;
    status: 'pending' | 'verified' | 'rejected';
}
interface Review {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    user: { id: number; name: string; avatar: string | null } | null;
}
interface Props {
    village: Village;
    reviews: { data: Review[]; current_page: number; last_page: number };
}

function RatingStars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    className="h-3.5 w-3.5"
                    fill={s <= rating ? '#f59e0b' : 'none'}
                    stroke={s <= rating ? '#f59e0b' : '#d1d5db'}
                />
            ))}
        </div>
    );
}

function Avatar({ name, avatar }: { name: string; avatar: string | null }) {
    if (avatar)
        return (
            <img
                src={`/storage/${avatar}`}
                alt={name}
                className="h-9 w-9 rounded-full object-cover"
            />
        );
    return (
        <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: 'var(--singgah-green-600)' }}
        >
            {name.charAt(0).toUpperCase()}
        </div>
    );
}

export default function ReviewsIndex({ village, reviews }: Props) {
    const avgRating =
        reviews.data.length > 0
            ? (
                  reviews.data.reduce((s, r) => s + r.rating, 0) /
                  reviews.data.length
              ).toFixed(1)
            : null;

    return (
        <ManagerLayout title="Ulasan Masuk" village={village}>
            <PageHeader
                title="Ulasan Masuk"
                subtitle="Pantau apa yang dikatakan pengunjung tentang desa Anda"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/manager' },
                    { label: 'Ulasan' },
                ]}
            />

            {/* Summary */}
            {avgRating && (
                <div className="mb-6 flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div
                        className="text-4xl font-extrabold text-gray-900"
                        style={{ fontFamily: 'var(--font-jakarta)' }}
                    >
                        {avgRating}
                    </div>
                    <div>
                        <RatingStars rating={Math.round(Number(avgRating))} />
                        <p className="mt-1 text-xs text-gray-400">
                            {reviews.data.length} ulasan pada halaman ini
                        </p>
                    </div>
                </div>
            )}

            {reviews.data.length === 0 ? (
                <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center shadow-sm">
                    <Star className="mx-auto mb-3 h-10 w-10 text-gray-200" />
                    <p className="text-sm text-gray-400">
                        Belum ada ulasan untuk desa Anda.
                    </p>
                    <p className="mt-1 text-xs text-gray-300">
                        Ulasan akan muncul setelah pengunjung menulis komentar.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {reviews.data.map((review) => (
                        <div
                            key={review.id}
                            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-start gap-3">
                                <Avatar
                                    name={review.user?.name ?? '?'}
                                    avatar={review.user?.avatar ?? null}
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="text-sm font-semibold text-gray-800">
                                            {review.user?.name ?? 'Pengunjung'}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(
                                                review.created_at,
                                            ).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <RatingStars rating={review.rating} />
                                    {review.comment && (
                                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ManagerLayout>
    );
}
