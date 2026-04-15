import { Head, Link, usePage } from '@inertiajs/react';
import {
    MapPin,
    Star,
    Calendar,
    ChevronRight,
    Trees,
    Users,
    Clock,
    ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import MediaGallery from '@/components/public/MediaGallery';
import ReviewForm from '@/components/public/ReviewForm';
import StarRating from '@/components/public/StarRating';
import BookmarkButton from '@/components/public/BookmarkButton';
import ShareButton from '@/components/public/ShareButton';
import PublicLayout from '@/layouts/PublicLayout';
import SmartPagination from '@/components/ui/smart-pagination';

// ─── Types ────────────────────────────────────────────────────────────────────

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
    user: { name: string; avatar: string | null } | null;
    created_at: string;
}
interface VillageEvent {
    id: number;
    slug: string;
    name: string;
    event_date: string;
    location: string | null;
    description: string | null;
    media: MediaItem[];
}
interface ContentItem {
    id: number;
    slug: string;
    name: string;
    location: string | null;
    price_min: number | null;
    price_max: number | null;
    contact_info: string | null;
    description: string | null;
    media: MediaItem[];
    reviews_avg_rating: number;
    reviews_count: number;
}

interface Village {
    id: number;
    name: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    category: string | null;
    category_label: string | null;
    address: string | null;
    map_url: string | null;
    media: MediaItem[];
    manager: { id: number; name: string; phone: string | null } | null;
    reviews: Review[];
    reviews_count: number;
    reviews_avg_rating: number;
    created_at: string;
}

interface Paginator<T> {
    data: T[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
}

interface Props {
    village: Village;
    events: Paginator<VillageEvent>;
    attractions: Paginator<ContentItem>;
    culinaries: Paginator<ContentItem>;
    accommodations: Paginator<ContentItem>;
    userReview: { id: number; rating: number; comment: string | null } | null;
    ratingBreakdown: Record<string, number>;
    isWishlisted: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number | null) =>
    n != null ? `Rp${n.toLocaleString('id-ID')}` : null;
const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

type Tab = 'beranda' | 'event' | 'wisata' | 'kuliner' | 'akomodasi' | 'ulasan';

const tabs: { id: Tab; label: string }[] = [
    { id: 'beranda', label: '🏡 Beranda' },
    { id: 'event', label: '📅 Event' },
    { id: 'wisata', label: '🗺️ Wisata' },
    { id: 'kuliner', label: '🍜 Kuliner' },
    { id: 'akomodasi', label: '🏠 Akomodasi' },
    { id: 'ulasan', label: '⭐ Ulasan' },
];

const categoryIcons: Record<string, string> = {
    pesisir_bahari: '🌊',
    agrowisata: '🌾',
    kuliner_lokal: '🍴',
    budaya_tradisi: '🎭',
    wisata_alam: '🏞️',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionEmpty({ message }: { message: string }) {
    return (
        <div
            className="rounded-2xl py-12 text-center"
            style={{ background: 'var(--singgah-green-50)' }}
        >
            <Trees
                className="mx-auto mb-3 h-10 w-10 opacity-30"
                style={{ color: 'var(--singgah-green-600)' }}
            />
            <p className="text-sm text-gray-500">{message}</p>
        </div>
    );
}

function ContentCard({
    item,
    href,
}: {
    item: ContentItem;
    href: string;
    type: string;
}) {
    const cover = item.media[0];
    const coverSrc = cover
        ? cover.file_path.startsWith('http')
            ? cover.file_path
            : `/storage/${cover.file_path}`
        : null;
    const rating = Number(item.reviews_avg_rating) || 0;

    return (
        <Link href={href} className="content-card group block p-2 md:p-4">
            {/* Cover */}
            <div className="relative h-40 overflow-hidden rounded-xl bg-gray-100">
                {coverSrc ? (
                    <img
                        src={coverSrc}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="flex h-full items-center justify-center"
                        style={{ background: 'var(--singgah-green-100)' }}
                    >
                        <Trees
                            className="h-8 w-8 opacity-30"
                            style={{ color: 'var(--singgah-green-700)' }}
                        />
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="pt-3">
                <h3 className="leading-tight font-semibold text-gray-900 transition-colors group-hover:text-(--singgah-green-700)">
                    {item.name}
                </h3>
                {item.location && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="line-clamp-1">{item.location}</span>
                    </div>
                )}
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold text-gray-700">
                            {rating > 0 ? rating.toFixed(1) : '—'}
                        </span>
                        {item.reviews_count > 0 && (
                            <span className="text-xs text-gray-400">
                                ({item.reviews_count})
                            </span>
                        )}
                    </div>
                    {(item.price_min || item.price_max) ? (
                        <span
                            className="text-xs font-medium"
                            style={{ color: 'var(--singgah-green-700)' }}
                        >
                            {fmt(item.price_min)}
                            {item.price_max && item.price_max !== item.price_min
                                ? ` – ${fmt(item.price_max)}`
                                : ''}
                        </span>
                    ) : (
                        <span className="text-xs text-singgah-green-700 font-medium">—</span>
                    )}
                </div>
            </div>
        </Link>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VillageShow({
    village,
    events,
    attractions,
    culinaries,
    accommodations,
    userReview,
    ratingBreakdown,
    isWishlisted,
}: Props) {
    const { auth } = usePage<{ auth: { user: { id: number } | null } }>().props;
    const [activeTab, setActiveTab] = useState<Tab>('beranda');
    const [eventFilter, setEventFilter] = useState<'upcoming' | 'all'>(
        'upcoming',
    );

    const isLoggedIn = !!auth?.user;
    const avgRating = Number(village.reviews_avg_rating) || 0;

    const now = new Date();
    const upcomingEvents = events.data.filter(
        (e) => new Date(e.event_date) >= now,
    );
    const displayedEvents =
        eventFilter === 'upcoming' ? upcomingEvents : events.data;

    return (
        <PublicLayout>
            <Head title={`${village.name} — Singgah`} />

            {/* Breadcrumb */}
            <div className="section-padding-x border-b border-gray-100 bg-white pt-20 pb-3">
                <div className="container max-w-7xl">
                    <nav className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Link href="/" className="hover:text-gray-700">
                            Beranda
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link href="/explore" className="hover:text-gray-700">
                            Jelajahi
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="font-medium text-gray-800">
                            {village.name}
                        </span>
                    </nav>
                </div>
            </div>

            <div className="section-padding-x py-8">
                <div className="container max-w-7xl">
                    <div className="flex gap-8 lg:items-start">
                        {/* ── Sticky Sidebar ── */}
                        <aside className="village-detail-sidebar hidden w-64 shrink-0 lg:block">
                            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                                {/* Cover */}
                                <div className="aspect-video overflow-hidden bg-gray-100">
                                    {village.media[0] ? (
                                        <img
                                            src={
                                                village.media[0].file_path.startsWith(
                                                    'http',
                                                )
                                                    ? village.media[0].file_path
                                                    : `/storage/${village.media[0].file_path}`
                                            }
                                            alt={village.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="flex h-full items-center justify-center"
                                            style={{
                                                background:
                                                    'var(--singgah-green-100)',
                                            }}
                                        >
                                            <Trees
                                                className="h-10 w-10 opacity-30"
                                                style={{
                                                    color: 'var(--singgah-green-700)',
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <h1
                                            className="leading-tight font-bold text-gray-900"
                                            style={{
                                                fontFamily: 'var(--font-jakarta)',
                                            }}
                                        >
                                            {village.name}
                                        </h1>
                                        <div className="flex shrink-0 -mt-1 -mr-1">
                                            <ShareButton
                                                url={typeof window !== 'undefined' ? window.location.href : ''}
                                                title={`${village.name} - Singgah`}
                                                description={village.short_description || `Jelajahi ${village.name} di Singgah.`}
                                            />
                                            <BookmarkButton
                                                type="village"
                                                id={village.id}
                                                initialWishlisted={isWishlisted}
                                                isLoggedIn={isLoggedIn}
                                            />
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="mt-2 flex items-center gap-2">
                                        <StarRating
                                            value={Math.round(avgRating)}
                                            size="sm"
                                        />
                                        <span className="text-xs text-gray-500">
                                            {avgRating > 0
                                                ? avgRating.toFixed(1)
                                                : '—'}{' '}
                                            ({village.reviews_count})
                                        </span>
                                    </div>

                                    {/* Category Badge */}
                                    {village.category &&
                                        village.category_label && (
                                            <div className="mt-3">
                                                <Link
                                                    href={`/explore?kategori=${village.category}`}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-(--singgah-green-400) hover:bg-(--singgah-green-50)"
                                                >
                                                    <span>
                                                        {categoryIcons[
                                                            village.category
                                                        ] || '🏞️'}
                                                    </span>
                                                    <span>
                                                        {village.category_label}
                                                    </span>
                                                </Link>
                                            </div>
                                        )}

                                    {village.address && (
                                        <div className="mt-3 flex items-start gap-1.5 text-xs text-gray-500">
                                            <MapPin
                                                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                                                style={{
                                                    color: 'var(--singgah-green-600)',
                                                }}
                                            />
                                            <span>{village.address}</span>
                                        </div>
                                    )}

                                    {village.manager && (
                                        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                                            <Users
                                                className="h-3.5 w-3.5 shrink-0"
                                                style={{
                                                    color: 'var(--singgah-green-600)',
                                                }}
                                            />
                                            <span>
                                                Dikelola oleh{' '}
                                                <strong>
                                                    {village.manager.name}
                                                </strong>
                                            </span>
                                        </div>
                                    )}

                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                                        <Clock
                                            className="h-3.5 w-3.5 shrink-0"
                                            style={{
                                                color: 'var(--singgah-green-600)',
                                            }}
                                        />
                                        <span>
                                            Bergabung{' '}
                                            {fmtDate(village.created_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Tab navigation */}
                                <nav className="border-t border-gray-100 p-2">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`village-tab-nav flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                                                activeTab === tab.id
                                                    ? 'font-semibold text-white'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                            style={
                                                activeTab === tab.id
                                                    ? {
                                                          background:
                                                              'var(--singgah-green-600)',
                                                      }
                                                    : {}
                                            }
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* ── Main content ── */}
                        <div className="min-w-0 flex-1">
                            {/* Mobile tab bar */}
                            <div className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                                            activeTab === tab.id
                                                ? 'text-white'
                                                : 'border border-gray-200 text-gray-600'
                                        }`}
                                        style={
                                            activeTab === tab.id
                                                ? {
                                                      background:
                                                          'var(--singgah-green-600)',
                                                  }
                                                : {}
                                        }
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* ────── Tab: Beranda ────── */}
                            {activeTab === 'beranda' && (
                                <div className="space-y-8">
                                    {/* Header mobile */}
                                    <div className="lg:hidden relative">
                                        <div className="absolute right-0 top-0 flex items-center">
                                            <ShareButton
                                                url={typeof window !== 'undefined' ? window.location.href : ''}
                                                title={`${village.name} - Singgah`}
                                                description={village.short_description || `Jelajahi ${village.name} di Singgah.`}
                                                size="sm"
                                            />
                                            <BookmarkButton
                                                type="village"
                                                id={village.id}
                                                initialWishlisted={isWishlisted}
                                                isLoggedIn={isLoggedIn}
                                                size="sm"
                                            />
                                        </div>
                                        <h1
                                            className="mb-1 pr-16 text-2xl font-bold text-gray-900"
                                            style={{
                                                fontFamily:
                                                    'var(--font-jakarta)',
                                            }}
                                        >
                                            {village.name}
                                        </h1>
                                        <div className="flex items-center gap-2">
                                            <StarRating
                                                value={Math.round(avgRating)}
                                                size="sm"
                                            />
                                            <span className="text-xs text-gray-500">
                                                {avgRating > 0
                                                    ? avgRating.toFixed(1)
                                                    : '—'}{' '}
                                                ({village.reviews_count} ulasan)
                                            </span>
                                        </div>
                                        {/* Category Badge Mobile */}
                                        {village.category &&
                                            village.category_label && (
                                                <div className="mt-2">
                                                    <Link
                                                        href={`/explore?kategori=${village.category}`}
                                                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-(--singgah-green-400) hover:bg-(--singgah-green-50)"
                                                    >
                                                        <span>
                                                            {categoryIcons[
                                                                village.category
                                                            ] || '🏞️'}
                                                        </span>
                                                        <span>
                                                            {
                                                                village.category_label
                                                            }
                                                        </span>
                                                    </Link>
                                                </div>
                                            )}
                                    </div>

                                    {/* Galeri */}
                                    {village.media.length > 0 && (
                                        <div>
                                            <h2 className="mb-3 font-semibold text-gray-800">
                                                Galeri Foto
                                            </h2>
                                            <MediaGallery
                                                media={village.media}
                                                maxVisible={5}
                                            />
                                        </div>
                                    )}

                                    {/* Deskripsi */}
                                    {village.description && (
                                        <div>
                                            <h2 className="mb-3 font-semibold text-gray-800">
                                                Tentang Desa
                                            </h2>
                                            <div
                                                className="prose leading-relaxed text-gray-600"
                                                dangerouslySetInnerHTML={{
                                                    __html: village.description,
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Maps embed */}
                                    {village.map_url && (
                                        <div>
                                            <div className="mb-3 flex items-center justify-between">
                                                <h2 className="font-semibold text-gray-800">
                                                    Lokasi
                                                </h2>
                                                <a
                                                    href={village.map_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-sm font-medium"
                                                    style={{
                                                        color: 'var(--singgah-green-600)',
                                                    }}
                                                >
                                                    Buka Maps{' '}
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </a>
                                            </div>
                                            <iframe
                                                src={
                                                    village.map_url
                                                        .replace(
                                                            '/maps/',
                                                            '/maps/embed/',
                                                        )
                                                        .replace(
                                                            '?q=',
                                                            '?pb=!1m18!1m12!1m3!1d2000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0!2s!5e0!3m2!1sid!2sid!4v0&q=',
                                                        )
                                                        .includes('embed')
                                                        ? village.map_url
                                                        : `https://maps.google.com/maps?q=${encodeURIComponent(village.address ?? village.name)}&output=embed`
                                                }
                                                title="Lokasi Desa"
                                                className="h-56 w-full rounded-2xl border-0"
                                                loading="lazy"
                                            />
                                        </div>
                                    )}

                                    {/* Highlight events */}
                                    {upcomingEvents.length > 0 && (
                                        <div>
                                            <div className="mb-3 flex items-center justify-between">
                                                <h2 className="font-semibold text-gray-800">
                                                    📅 Event Mendatang
                                                </h2>
                                                <button
                                                    onClick={() =>
                                                        setActiveTab('event')
                                                    }
                                                    className="text-sm font-medium"
                                                    style={{
                                                        color: 'var(--singgah-green-600)',
                                                    }}
                                                >
                                                    Lihat semua
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {upcomingEvents
                                                    .slice(0, 3)
                                                    .map((ev) => (
                                                        <Link
                                                            key={ev.id}
                                                            href={`/desa/${village.slug}/events/${ev.slug}`}
                                                            className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md"
                                                        >
                                                            <div
                                                                className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl text-white"
                                                                style={{
                                                                    background:
                                                                        'var(--singgah-green-600)',
                                                                }}
                                                            >
                                                                <span className="text-xs font-medium">
                                                                    {new Date(
                                                                        ev.event_date,
                                                                    ).toLocaleDateString(
                                                                        'id-ID',
                                                                        {
                                                                            month: 'short',
                                                                        },
                                                                    )}
                                                                </span>
                                                                <span className="text-lg leading-none font-bold">
                                                                    {new Date(
                                                                        ev.event_date,
                                                                    ).getDate()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900">
                                                                    {ev.name}
                                                                </p>
                                                                {ev.location && (
                                                                    <p className="text-xs text-gray-500">
                                                                        {
                                                                            ev.location
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Highlight wisata */}
                                    {attractions.data.length > 0 && (
                                        <div>
                                            <div className="mb-3 flex items-center justify-between">
                                                <h2 className="font-semibold text-gray-800">
                                                    🗺️ Wisata Unggulan
                                                </h2>
                                                <button
                                                    onClick={() =>
                                                        setActiveTab('wisata')
                                                    }
                                                    className="text-sm font-medium"
                                                    style={{
                                                        color: 'var(--singgah-green-600)',
                                                    }}
                                                >
                                                    Lihat semua
                                                </button>
                                            </div>
                                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                {attractions.data
                                                    .slice(0, 3)
                                                    .map((a) => (
                                                        <ContentCard
                                                            key={a.id}
                                                            item={a}
                                                            href={`/desa/${village.slug}/attractions/${a.slug}`}
                                                            type="attraction"
                                                        />
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ────── Tab: Event ────── */}
                            {activeTab === 'event' && (
                                <div>
                                    <div className="mb-5 flex items-center justify-between">
                                        <h2 className="font-semibold text-gray-800">
                                            Event Desa
                                        </h2>
                                        <div className="flex gap-2">
                                            {(['upcoming', 'all'] as const).map(
                                                (f) => (
                                                    <button
                                                        key={f}
                                                        onClick={() =>
                                                            setEventFilter(f)
                                                        }
                                                        className={`rounded-full px-3 py-1 text-sm transition-colors ${eventFilter === f ? 'text-white' : 'border border-gray-200 text-gray-600'}`}
                                                        style={
                                                            eventFilter === f
                                                                ? {
                                                                      background:
                                                                          'var(--singgah-green-600)',
                                                                  }
                                                                : {}
                                                        }
                                                    >
                                                        {f === 'upcoming'
                                                            ? 'Mendatang'
                                                            : 'Semua'}
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {displayedEvents.length === 0 ? (
                                        <SectionEmpty message="Tidak ada event saat ini." />
                                    ) : (
                                        <div className="space-y-4">
                                            {displayedEvents.map((ev) => {
                                                const evCover = ev.media[0];
                                                const evSrc = evCover
                                                    ? evCover.file_path.startsWith(
                                                          'http',
                                                      )
                                                        ? evCover.file_path
                                                        : `/storage/${evCover.file_path}`
                                                    : null;
                                                return (
                                                    <Link
                                                        key={ev.id}
                                                        href={`/desa/${village.slug}/events/${ev.slug}`}
                                                        className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md"
                                                    >
                                                        {evSrc && (
                                                            <img
                                                                src={evSrc}
                                                                alt={ev.name}
                                                                className="h-20 w-24 shrink-0 rounded-xl object-cover"
                                                            />
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-900">
                                                                {ev.name}
                                                            </p>
                                                            <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                                                <Calendar className="h-3.5 w-3.5" />
                                                                <span>
                                                                    {fmtDate(
                                                                        ev.event_date,
                                                                    )}
                                                                </span>
                                                            </div>
                                                            {ev.location && (
                                                                <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                                                    <MapPin className="h-3.5 w-3.5" />
                                                                    <span>
                                                                        {
                                                                            ev.location
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ────── Tab: Wisata ────── */}
                            {activeTab === 'wisata' && (
                                <div>
                                    <h2 className="mb-5 font-semibold text-gray-800">
                                        Wisata & Atraksi
                                    </h2>
                                    {attractions.data.length === 0 ? (
                                        <SectionEmpty message="Belum ada wisata yang terdaftar." />
                                    ) : (
                                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                            {attractions.data.map((a) => (
                                                <ContentCard
                                                    key={a.id}
                                                    item={a}
                                                    href={`/desa/${village.slug}/attractions/${a.slug}`}
                                                    type="attraction"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {attractions.last_page > 1 && (
                                        <div className="mt-8">
                                            <SmartPagination
                                                links={attractions.links}
                                                currentPage={attractions.current_page}
                                                lastPage={attractions.last_page}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ────── Tab: Kuliner ────── */}
                            {activeTab === 'kuliner' && (
                                <div>
                                    <h2 className="mb-5 font-semibold text-gray-800">
                                        Kuliner & UMKM
                                    </h2>
                                    {culinaries.data.length === 0 ? (
                                        <SectionEmpty message="Belum ada kuliner yang terdaftar." />
                                    ) : (
                                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                            {culinaries.data.map((c) => (
                                                <ContentCard
                                                    key={c.id}
                                                    item={c}
                                                    href={`/desa/${village.slug}/culinaries/${c.slug}`}
                                                    type="culinary"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {culinaries.last_page > 1 && (
                                        <div className="mt-8">
                                            <SmartPagination
                                                links={culinaries.links}
                                                currentPage={culinaries.current_page}
                                                lastPage={culinaries.last_page}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ────── Tab: Akomodasi ────── */}
                            {activeTab === 'akomodasi' && (
                                <div>
                                    <h2 className="mb-5 font-semibold text-gray-800">
                                        Akomodasi
                                    </h2>
                                    {accommodations.data.length === 0 ? (
                                        <SectionEmpty message="Belum ada akomodasi yang terdaftar." />
                                    ) : (
                                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                            {accommodations.data.map((a) => (
                                                <ContentCard
                                                    key={a.id}
                                                    item={a}
                                                    href={`/desa/${village.slug}/accommodations/${a.slug}`}
                                                    type="accommodation"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {accommodations.last_page > 1 && (
                                        <div className="mt-8">
                                            <SmartPagination
                                                links={accommodations.links}
                                                currentPage={accommodations.current_page}
                                                lastPage={accommodations.last_page}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ────── Tab: Ulasan ────── */}
                            {activeTab === 'ulasan' && (
                                <div className="space-y-8">
                                    {/* Rating aggregate */}
                                    <div className="rounded-2xl border border-gray-100 bg-white p-6">
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <p
                                                    className="text-5xl font-extrabold"
                                                    style={{
                                                        color: 'var(--singgah-green-700)',
                                                    }}
                                                >
                                                    {avgRating > 0
                                                        ? avgRating.toFixed(1)
                                                        : '—'}
                                                </p>
                                                <StarRating
                                                    value={Math.round(
                                                        avgRating,
                                                    )}
                                                    size="sm"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {village.reviews_count}{' '}
                                                    ulasan
                                                </p>
                                            </div>
                                            <div className="flex-1 space-y-1.5">
                                                {[5, 4, 3, 2, 1].map((star) => {
                                                    const cnt =
                                                        ratingBreakdown[star] ??
                                                        0;
                                                    const pct =
                                                        village.reviews_count >
                                                        0
                                                            ? (cnt /
                                                                  village.reviews_count) *
                                                              100
                                                            : 0;
                                                    return (
                                                        <div
                                                            key={star}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <span className="w-4 text-right text-xs text-gray-500">
                                                                {star}
                                                            </span>
                                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                                                                <div
                                                                    className="h-full rounded-full transition-all"
                                                                    style={{
                                                                        width: `${pct}%`,
                                                                        background:
                                                                            'var(--singgah-green-500)',
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="w-6 text-xs text-gray-400">
                                                                {cnt}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Review form */}
                                    <div>
                                        <h3 className="mb-4 font-semibold text-gray-800">
                                            Tulis Ulasan
                                        </h3>
                                        <ReviewForm
                                            reviewableType="village"
                                            reviewableId={village.id}
                                            isLoggedIn={isLoggedIn}
                                            existingReview={userReview}
                                        />
                                    </div>

                                    {/* Review list */}
                                    {village.reviews.length > 0 && (
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-800">
                                                Ulasan Pengunjung
                                            </h3>
                                            <div className="space-y-4">
                                                {village.reviews.map((r) => (
                                                    <div
                                                        key={r.id}
                                                        className="review-item rounded-2xl border border-gray-100 bg-white p-4"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="flex h-9 w-9 items-center justify-center rounded-full font-semibold text-white"
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
                                                                        {r.user
                                                                            ?.name ??
                                                                            'Anonim'}
                                                                    </p>
                                                                    <StarRating
                                                                        value={
                                                                            r.rating
                                                                        }
                                                                        size="sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <span className="text-xs text-gray-400">
                                                                {fmtDate(
                                                                    r.created_at,
                                                                )}
                                                            </span>
                                                        </div>
                                                        {r.comment && (
                                                            <p className="mt-3 text-sm leading-relaxed text-gray-600">
                                                                {r.comment}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
