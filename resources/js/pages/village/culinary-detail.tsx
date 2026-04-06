import { Head, Link, usePage } from '@inertiajs/react';
import { MapPin, Phone, IndianRupee, ChevronRight } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import MediaGallery from '@/components/public/MediaGallery';
import StarRating from '@/components/public/StarRating';
import ReviewForm from '@/components/public/ReviewForm';
import BookmarkButton from '@/components/public/BookmarkButton';
import ShareButton from '@/components/public/ShareButton';

interface MediaItem {
    id: number;
    file_path: string;
    type: 'image' | 'video';
    alt_text?: string;
}
interface Review {
    id: number;
    rating: number;
    comment: string | null;
    user: { name: string } | null;
    created_at: string;
}

interface Culinary {
    id: number;
    name: string;
    location: string | null;
    description: string | null;
    price_min: number | null;
    price_max: number | null;
    contact_info: string | null;
    media: MediaItem[];
    reviews: Review[];
    reviews_count: number;
    reviews_avg_rating: number;
}

interface Props {
    village: { id: number; name: string; slug: string };
    culinary: Culinary;
    userReview: { id: number; rating: number; comment: string | null } | null;
    isWishlisted?: boolean;
}

const fmt = (n: number | null) =>
    n != null ? `Rp${n.toLocaleString('id-ID')}` : null;
const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

export default function CulinaryDetail({
    village,
    culinary,
    userReview,
    isWishlisted = false,
}: Props) {
    const { auth } = usePage<{ auth: { user: { id: number } | null } }>().props;
    const isLoggedIn = !!auth?.user;
    const avg = culinary.reviews_avg_rating || 0;

    return (
        <PublicLayout>
            <Head title={`${culinary.name} — ${village.name} — Singgah`} />

            {/* Breadcrumb */}
            <div className="section-padding-x border-b border-gray-100 bg-white pt-20 pb-3">
                <div className="container max-w-4xl">
                    <nav className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                        <Link href="/" className="hover:text-gray-700">
                            Beranda
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link href="/explore" className="hover:text-gray-700">
                            Jelajahi
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link
                            href={`/desa/${village.slug}`}
                            className="hover:text-gray-700"
                        >
                            {village.name}
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="font-medium text-gray-800">
                            {culinary.name}
                        </span>
                    </nav>
                </div>
            </div>

            <section className="section-padding-x py-10">
                <div className="container max-w-4xl">
                    <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
                        {/* Left */}
                        <div className="space-y-8">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <span
                                        className="mb-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white"
                                        style={{
                                            background: 'var(--singgah-earth-400)',
                                        }}
                                    >
                                        🍜 Kuliner & UMKM
                                    </span>
                                    <h1
                                        className="mb-2 text-2xl font-bold text-gray-900"
                                        style={{
                                            fontFamily: 'var(--font-jakarta)',
                                        }}
                                    >
                                        {culinary.name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-1.5">
                                        <StarRating
                                            value={Math.round(avg)}
                                            size="sm"
                                            showLabel
                                        />
                                        <span className="text-xs text-gray-400">
                                            ({culinary.reviews_count} ulasan)
                                        </span>
                                    </div>
                                    {culinary.location && (
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <MapPin
                                                className="h-4 w-4"
                                                style={{
                                                    color: 'var(--singgah-green-600)',
                                                }}
                                            />
                                            {culinary.location}
                                        </div>
                                    )}
                                    </div>
                                </div>
                                <div className="flex shrink-0 gap-1 mt-6 -mr-2">
                                    <ShareButton
                                        url={typeof window !== 'undefined' ? window.location.href : ''}
                                        title={`${culinary.name} - Singgah`}
                                    />
                                    <BookmarkButton
                                        type="culinary"
                                        id={culinary.id}
                                        initialWishlisted={isWishlisted}
                                        isLoggedIn={isLoggedIn}
                                    />
                                </div>
                            </div>

                            {culinary.media.length > 0 && (
                                <MediaGallery
                                    media={culinary.media}
                                    maxVisible={6}
                                />
                            )}

                            {culinary.description && (
                                <div>
                                    <h2 className="mb-3 font-semibold text-gray-800">
                                        Deskripsi
                                    </h2>
                                    <div
                                        className="prose leading-relaxed text-gray-600"
                                        dangerouslySetInnerHTML={{
                                            __html: culinary.description,
                                        }}
                                    />
                                </div>
                            )}

                            <div>
                                <h2 className="mb-4 font-semibold text-gray-800">
                                    Ulasan
                                </h2>
                                <ReviewForm
                                    reviewableType="culinary"
                                    reviewableId={culinary.id}
                                    isLoggedIn={isLoggedIn}
                                    existingReview={userReview}
                                />
                                {culinary.reviews.length > 0 && (
                                    <div className="mt-5 space-y-3">
                                        {culinary.reviews.map((r) => (
                                            <div
                                                key={r.id}
                                                className="review-item rounded-2xl border border-gray-100 bg-white p-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white"
                                                            style={{
                                                                background:
                                                                    'var(--singgah-green-600)',
                                                            }}
                                                        >
                                                            {r.user?.name?.[0]?.toUpperCase() ??
                                                                '?'}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-800">
                                                                {r.user?.name ??
                                                                    'Anonim'}
                                                            </p>
                                                            <StarRating
                                                                value={r.rating}
                                                                size="sm"
                                                            />
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        {fmtDate(r.created_at)}
                                                    </span>
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
                        </div>

                        {/* Right */}
                        <div className="space-y-4">
                            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                                <h2 className="mb-4 font-semibold text-gray-800">
                                    Informasi
                                </h2>
                                {(culinary.price_min || culinary.price_max) && (
                                    <div className="mb-3 flex items-start gap-3">
                                        <IndianRupee
                                            className="mt-0.5 h-4 w-4 shrink-0"
                                            style={{
                                                color: 'var(--singgah-green-600)',
                                            }}
                                        />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Harga
                                            </p>
                                            <p className="font-semibold text-gray-800">
                                                {fmt(culinary.price_min)}
                                                {culinary.price_max &&
                                                culinary.price_max !==
                                                    culinary.price_min
                                                    ? ` – ${fmt(culinary.price_max)}`
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {culinary.contact_info && (
                                    <div className="flex items-start gap-3">
                                        <Phone
                                            className="mt-0.5 h-4 w-4 shrink-0"
                                            style={{
                                                color: 'var(--singgah-green-600)',
                                            }}
                                        />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Kontak
                                            </p>
                                            <p className="text-sm text-gray-800">
                                                {culinary.contact_info}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Link
                                href={`/desa/${village.slug}`}
                                className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 text-sm font-medium transition-shadow hover:shadow-md"
                                style={{ color: 'var(--singgah-green-700)' }}
                            >
                                <ChevronRight className="h-4 w-4 rotate-180" />
                                Kembali ke {village.name}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
