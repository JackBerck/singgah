import { Head, Link, usePage } from '@inertiajs/react';
import { MapPin, Phone, IndianRupee, ChevronRight, Clock, ExternalLink } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import MediaGallery from '@/components/public/MediaGallery';
import StarRating from '@/components/public/StarRating';
import ReviewForm from '@/components/public/ReviewForm';
import ReviewItem from '@/components/public/ReviewItem';
import SmartPagination from '@/components/ui/smart-pagination';
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
    user: { id: number; name: string; avatar: string | null } | null;
    created_at: string;
}

interface Paginator<T> {
    data: T[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
}

interface Attraction {
    id: number;
    name: string;
    location: string | null;
    description: string | null;
    price_min: number | null;
    price_max: number | null;
    contact_info: string | null;
    open_time: string | null;
    close_time: string | null;
    map_url: string | null;
    media: MediaItem[];
    reviews_count: number;
    reviews_avg_rating: number;
}

interface Props {
    village: { id: number; name: string; slug: string };
    attraction: Attraction;
    reviews: Paginator<Review>;
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

export default function AttractionDetail({
    village,
    attraction,
    reviews,
    userReview,
    isWishlisted = false,
}: Props) {
    const { auth } = usePage<{ auth: { user: { id: number } | null } }>().props;
    const isLoggedIn = !!auth?.user;
    const avg = attraction.reviews_avg_rating || 0;

    return (
        <PublicLayout>
            <Head title={`${attraction.name} — ${village.name} — Singgah`} />

            {/* Breadcrumb */}
            <div className="section-padding-x border-b border-gray-100 bg-white pt-20 pb-3">
                <div className="container max-w-7xl">
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
                            {attraction.name}
                        </span>
                    </nav>
                </div>
            </div>

            <section className="section-padding-x py-10">
                <div className="container max-w-7xl">
                    <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
                        {/* Left */}
                        <div className="space-y-8">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1
                                        className="mb-2 text-2xl font-bold text-gray-900"
                                        style={{
                                            fontFamily: 'var(--font-jakarta)',
                                        }}
                                    >
                                        {attraction.name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-1.5">
                                        <StarRating
                                            value={Math.round(avg)}
                                            size="sm"
                                            showLabel
                                        />
                                        <span className="text-xs text-gray-400">
                                            ({attraction.reviews_count} ulasan)
                                        </span>
                                    </div>
                                    {attraction.location && (
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <MapPin
                                                className="h-4 w-4"
                                                style={{
                                                    color: 'var(--singgah-green-600)',
                                                }}
                                            />
                                            {attraction.location}
                                        </div>
                                    )}
                                    </div>
                                </div>
                                <div className="flex shrink-0 gap-1 -mt-2 -mr-2">
                                    <ShareButton
                                        url={typeof window !== 'undefined' ? window.location.href : ''}
                                        title={`${attraction.name} - Singgah`}
                                    />
                                    <BookmarkButton
                                        type="attraction"
                                        id={attraction.id}
                                        initialWishlisted={isWishlisted}
                                        isLoggedIn={isLoggedIn}
                                    />
                                </div>
                            </div>

                            {attraction.media.length > 0 && (
                                <MediaGallery
                                    media={attraction.media}
                                    maxVisible={6}
                                />
                            )}

                            {attraction.description && (
                                <div>
                                    <h2 className="mb-3 font-semibold text-gray-800">
                                        Deskripsi
                                    </h2>
                                    <div
                                        className="prose leading-relaxed text-gray-600"
                                        dangerouslySetInnerHTML={{
                                            __html: attraction.description,
                                        }}
                                    />
                                </div>
                            )}

                            {/* Reviews */}
                            <div>
                                <h2 className="mb-4 font-semibold text-gray-800">
                                    Ulasan
                                </h2>
                                <ReviewForm
                                    reviewableType="attraction"
                                    reviewableId={attraction.id}
                                    isLoggedIn={isLoggedIn}
                                    existingReview={userReview}
                                />
                                {reviews.data.length > 0 && (
                                    <div className="mt-5 space-y-3">
                                        {reviews.data.map((r) => (
                                            <ReviewItem key={r.id} review={r} currentUserId={auth?.user?.id} />
                                        ))}
                                    </div>
                                )}
                                {reviews.last_page > 1 && (
                                    <div className="mt-8">
                                        <SmartPagination
                                            links={reviews.links}
                                            currentPage={reviews.current_page}
                                            lastPage={reviews.last_page}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right — Info card */}
                        <div className="space-y-4">
                            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                                <h2 className="mb-4 font-semibold text-gray-800">
                                    Informasi
                                </h2>
                                {(attraction.price_min ||
                                    attraction.price_max) && (
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
                                                {fmt(attraction.price_min)}
                                                {attraction.price_max &&
                                                attraction.price_max !==
                                                    attraction.price_min
                                                    ? ` – ${fmt(attraction.price_max)}`
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {attraction.contact_info && (
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
                                                <a href={`https://wa.me/${attraction.contact_info.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                    {attraction.contact_info}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {(attraction.open_time || attraction.close_time) && (
                                    <div className="flex items-start gap-3 mt-3">
                                        <Clock
                                            className="mt-0.5 h-4 w-4 shrink-0"
                                            style={{
                                                color: 'var(--singgah-green-600)',
                                            }}
                                        />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Jam Buka
                                            </p>
                                            <p className="font-semibold text-gray-800 text-sm">
                                                {attraction.open_time ? attraction.open_time.slice(0, 5) : '—'} - {attraction.close_time ? attraction.close_time.slice(0, 5) : '—'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {attraction.map_url && (
                                    <div className="flex items-start gap-3 mt-4">
                                        <MapPin
                                            className="mt-0.5 h-4 w-4 shrink-0"
                                            style={{
                                                color: 'var(--singgah-green-600)',
                                            }}
                                        />
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">
                                                Google Maps
                                            </p>
                                            <a
                                                href={attraction.map_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-(--singgah-green-400) hover:bg-(--singgah-green-50)"
                                                style={{ color: 'var(--singgah-green-700)' }}
                                            >
                                                <span>Buka Peta</span>
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
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
