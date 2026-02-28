import { Head, Link } from '@inertiajs/react';
import {
    MapPin,
    Star,
    ArrowRight,
    Search,
    ChevronRight,
    Trees,
    Landmark,
    UtensilsCrossed,
    Sprout,
    Waves,
    Palette,
} from 'lucide-react';

import PublicLayout from '@/layouts/PublicLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Village {
    id: number;
    name: string;
    slug: string;
    short_description: string | null;
    address: string | null;
    is_featured: boolean;
    cover_image: string | null;
    reviews_count: number;
    reviews_avg_rating: number;
}

interface Stats {
    villages_count: number;
    provinces_count: number;
    visitors_count: number;
}

interface HomeProps {
    featuredVillages: Village[];
    newVillages: Village[];
    stats: Stats;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const categories = [
    { icon: Trees, label: 'Wisata Alam', count: 142, slug: 'alam' },
    { icon: Landmark, label: 'Budaya & Tradisi', count: 98, slug: 'budaya' },
    {
        icon: UtensilsCrossed,
        label: 'Kuliner Lokal',
        count: 76,
        slug: 'kuliner',
    },
    { icon: Sprout, label: 'Agrowisata', count: 64, slug: 'agrowisata' },
    { icon: Waves, label: 'Pesisir & Bahari', count: 53, slug: 'pesisir' },
    { icon: Palette, label: 'Desa Kreatif', count: 38, slug: 'kreatif' },
];

const regions = [
    {
        name: 'Bali',
        province: 'Bali',
        count: 48,
        image: 'bali',
        gradient: 'from-orange-900/70 to-orange-600/40',
    },
    {
        name: 'Yogyakarta',
        province: 'D.I. Yogyakarta',
        count: 32,
        image: 'yogyakarta',
        gradient: 'from-slate-900/70 to-slate-600/40',
    },
    {
        name: 'Lombok',
        province: 'Nusa Tenggara Barat',
        count: 27,
        image: 'lombok',
        gradient: 'from-teal-900/70 to-teal-600/40',
    },
    {
        name: 'Jawa Barat',
        province: 'Jawa Barat',
        count: 84,
        image: 'jabar',
        gradient: 'from-green-900/70 to-green-600/40',
    },
    {
        name: 'Danau Toba',
        province: 'Sumatera Utara',
        count: 21,
        image: 'toba',
        gradient: 'from-blue-900/70 to-blue-600/40',
    },
    {
        name: 'Toraja',
        province: 'Sulawesi Selatan',
        count: 18,
        image: 'toraja',
        gradient: 'from-amber-900/70 to-amber-600/40',
    },
    {
        name: 'Flores',
        province: 'Nusa Tenggara Timur',
        count: 23,
        image: 'flores',
        gradient: 'from-rose-900/70 to-rose-600/40',
    },
    {
        name: 'Kalimantan Timur',
        province: 'Kalimantan Timur',
        count: 15,
        image: 'kaltim',
        gradient: 'from-emerald-900/70 to-emerald-600/40',
    },
];

// Unsplash landscape colors as CSS background fallback per region
const regionColors: Record<string, string> = {
    bali: '#7c3b1e',
    yogyakarta: '#2e3a4e',
    lombok: '#0e6b5e',
    jabar: '#1b5e35',
    toba: '#1a3a6b',
    toraja: '#7a4b10',
    flores: '#7b2233',
    kaltim: '#1a5c3a',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function VillageCard({ village }: { village: Village }) {
    const rating = village.reviews_avg_rating || 0;
    const reviewCount = village.reviews_count || 0;

    // Extract kota from address (e.g. "Desa X, Kec. Y, Kab. Z, Bali 80613" → "Bali")
    const locationParts = village.address?.split(',') ?? [];
    const location =
        locationParts.length > 2
            ? locationParts.slice(-2).join(',').trim()
            : (village.address ?? '');

    return (
        <Link
            href={`/desa/${village.slug}`}
            className="village-card group block w-64 flex-shrink-0 sm:w-auto"
        >
            {/* Gambar */}
            <div className="relative h-44 overflow-hidden bg-gray-100">
                {village.cover_image ? (
                    <img
                        src={`/storage/${village.cover_image}`}
                        alt={village.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="flex h-full w-full items-center justify-center"
                        style={{ background: 'var(--singgah-green-200)' }}
                    >
                        <Trees
                            className="h-12 w-12 opacity-30"
                            style={{ color: 'var(--singgah-green-700)' }}
                        />
                    </div>
                )}
                {village.is_featured && (
                    <span
                        className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                        style={{ background: 'var(--singgah-earth-400)' }}
                    >
                        ⭐ Featured
                    </span>
                )}
            </div>

            {/* Konten */}
            <div className="p-4">
                <h3 className="line-clamp-1 font-semibold text-gray-900 transition-colors group-hover:text-[var(--singgah-green-700)]">
                    {village.name}
                </h3>
                {location && (
                    <div className="small-font-size mt-1.5 flex items-center gap-1 text-gray-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="line-clamp-1">{location}</span>
                    </div>
                )}
                {village.short_description && (
                    <p className="small-font-size mt-2 line-clamp-2 leading-relaxed text-gray-500">
                        {village.short_description}
                    </p>
                )}
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1">
                        <Star className="rating-star h-3.5 w-3.5 fill-current" />
                        <span className="small-font-size font-semibold text-gray-800">
                            {rating > 0 ? rating.toFixed(1) : '—'}
                        </span>
                        {reviewCount > 0 && (
                            <span className="small-font-size text-gray-400">
                                ({reviewCount})
                            </span>
                        )}
                    </div>
                    <span
                        className="small-font-size flex items-center gap-0.5 font-medium transition-colors group-hover:text-[var(--singgah-green-600)]"
                        style={{ color: 'var(--singgah-green-600)' }}
                    >
                        Lihat Detail <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

function SectionHeader({
    label,
    title,
    subtitle,
    cta,
    ctaHref,
}: {
    label: string;
    title: string;
    subtitle?: string;
    cta?: string;
    ctaHref?: string;
}) {
    return (
        <div className="section-header flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <span className="section-label">{label}</span>
                <h2 className="section-title">{title}</h2>
                {subtitle && <p className="section-subtitle">{subtitle}</p>}
            </div>
            {cta && ctaHref && (
                <Link
                    href={ctaHref}
                    className="normal-font-size flex flex-shrink-0 items-center gap-1.5 font-semibold transition-colors hover:underline"
                    style={{ color: 'var(--singgah-green-600)' }}
                >
                    {cta} <ArrowRight className="h-4 w-4" />
                </Link>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home({
    featuredVillages,
    newVillages,
    stats,
}: HomeProps) {
    const formatNumber = (n: number) =>
        n >= 1000 ? `${(n / 1000).toFixed(0)}k+` : `${n}+`;

    const statItems = [
        { value: formatNumber(stats.villages_count), label: 'Desa Wisata' },
        { value: `${stats.provinces_count}`, label: 'Provinsi' },
        { value: formatNumber(stats.visitors_count), label: 'Pengunjung' },
    ];

    return (
        <PublicLayout>
            <Head title="Singgah — Jelajahi Keindahan Desa" />

            {/* ══════════════════════════════════════════════════════════════════
                SECTION 1: HERO
            ══════════════════════════════════════════════════════════════════ */}
            <section className="hero-gradient relative flex min-h-screen items-center overflow-hidden">
                {/* Decorative SVG Pattern */}
                <div className="absolute inset-0 opacity-[0.06]" aria-hidden>
                    <svg
                        className="h-full w-full"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <pattern
                                id="batik"
                                x="0"
                                y="0"
                                width="80"
                                height="80"
                                patternUnits="userSpaceOnUse"
                            >
                                <circle
                                    cx="40"
                                    cy="40"
                                    r="18"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1.5"
                                />
                                <circle
                                    cx="40"
                                    cy="40"
                                    r="8"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1"
                                />
                                <circle
                                    cx="0"
                                    cy="0"
                                    r="8"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1"
                                />
                                <circle
                                    cx="80"
                                    cy="0"
                                    r="8"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1"
                                />
                                <circle
                                    cx="0"
                                    cy="80"
                                    r="8"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1"
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="8"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1"
                                />
                                <line
                                    x1="22"
                                    y1="40"
                                    x2="58"
                                    y2="40"
                                    stroke="white"
                                    strokeWidth="0.75"
                                />
                                <line
                                    x1="40"
                                    y1="22"
                                    x2="40"
                                    y2="58"
                                    stroke="white"
                                    strokeWidth="0.75"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#batik)" />
                    </svg>
                </div>

                {/* Gradient Glow Blobs */}
                <div
                    className="absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
                    style={{ background: 'var(--singgah-teal-400)' }}
                    aria-hidden
                />
                <div
                    className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full opacity-15 blur-3xl"
                    style={{ background: 'var(--singgah-earth-400)' }}
                    aria-hidden
                />

                <div className="section-padding-x relative z-10 w-full pb-16 pt-24 md:pb-20 md:pt-28">
                    <div className="container max-w-7xl">
                        <div className="max-w-3xl">
                            {/* Badge */}
                            <div
                                className="small-font-size mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-medium"
                                style={{
                                    borderColor: 'rgba(255,255,255,0.25)',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.9)',
                                }}
                            >
                                🌿 Platform Desa Wisata #1 Indonesia
                            </div>

                            {/* Headline */}
                            <h1
                                className="mb-5 font-extrabold leading-[1.12] text-white"
                                style={{
                                    fontFamily: 'var(--font-jakarta)',
                                    fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                                }}
                            >
                                Temukan Keindahan
                                <br />
                                <span
                                    style={{ color: 'var(--singgah-teal-400)' }}
                                >
                                    Desa Wisata
                                </span>
                                <br />
                                Indonesia
                            </h1>

                            {/* Subheadline */}
                            <p
                                className="mb-8 max-w-xl text-lg leading-relaxed md:text-xl"
                                style={{ color: 'rgba(255,255,255,0.78)' }}
                            >
                                Dari pantai Lombok hingga ladang Dieng, ribuan
                                desa wisata dengan budaya, kuliner, dan alam
                                yang autentik menanti untuk dijelajahi.
                            </p>

                            {/* CTA Buttons */}
                            <div className="mb-10 flex flex-wrap gap-3">
                                <Link
                                    href="/explore"
                                    className="btn-primary px-7 py-3.5 text-base"
                                >
                                    Jelajahi Sekarang{' '}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/tentang"
                                    className="btn-outline-white px-7 py-3.5 text-base"
                                >
                                    Tentang Kami
                                </Link>
                            </div>

                            {/* Search Bar */}
                            <div
                                className="flex max-w-lg items-center gap-2 rounded-2xl p-1.5"
                                style={{
                                    background: 'rgba(255,255,255,0.12)',
                                    border: '1.5px solid rgba(255,255,255,0.2)',
                                }}
                            >
                                <div className="flex flex-1 items-center gap-2 rounded-xl bg-white px-4 py-2.5">
                                    <Search className="h-4 w-4 shrink-0 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari desa wisata atau wilayah..."
                                        className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                                    />
                                </div>
                                <button
                                    className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                                    style={{
                                        background: 'var(--singgah-teal-500)',
                                    }}
                                >
                                    Cari
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Wave */}
                <div
                    className="absolute bottom-0 left-0 right-0 leading-none"
                    style={{ marginBottom: '-1px' }}
                >
                    <svg
                        viewBox="0 0 1440 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0 60L60 53.3C120 46.7 240 33.3 360 26.7C480 20 600 20 720 26.7C840 33.3 960 46.7 1080 50C1200 53.3 1320 46.7 1380 43.3L1440 40V60H0Z"
                            fill="#f0faf4"
                        />
                    </svg>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════
                SECTION 2: KATEGORI DESA
            ══════════════════════════════════════════════════════════════════ */}
            <section
                className="section-padding-x py-16 md:py-20"
                style={{ background: 'var(--singgah-green-50)' }}
            >
                <div className="container max-w-7xl">
                    <SectionHeader
                        label="✦ Kategori"
                        title="Temukan Desa Berdasarkan Kategori"
                        subtitle="Pilih jenis wisata yang paling sesuai dengan minat Anda"
                    />

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
                        {categories.map(
                            ({ icon: Icon, label, count, slug }) => (
                                <Link
                                    key={slug}
                                    href={`/explore?kategori=${slug}`}
                                    className="category-card group text-center"
                                >
                                    <span
                                        className="category-icon flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
                                        style={{
                                            background:
                                                'var(--singgah-green-100)',
                                            color: 'var(--singgah-green-700)',
                                        }}
                                    >
                                        <Icon className="h-6 w-6" />
                                    </span>
                                    <span className="category-label small-font-size text-center font-semibold leading-tight text-gray-700 group-hover:text-gray-100">
                                        {label}
                                    </span>
                                    <span
                                        className="small-font-size group-hover:text-gray-100 text-singgah-green-600"
                                    >
                                        {count} desa
                                    </span>
                                </Link>
                            ),
                        )}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════
                SECTION 3: DESA PILIHAN
            ══════════════════════════════════════════════════════════════════ */}
            <section className="section-padding-x bg-white py-16 md:py-20">
                <div className="container max-w-7xl">
                    <SectionHeader
                        label="🌟 Desa Pilihan"
                        title="Desa Pilihan Minggu Ini"
                        subtitle="Desa paling banyak dikunjungi dan dibicarakan wisatawan"
                        cta="Lihat Semua"
                        ctaHref="/explore"
                    />

                    {featuredVillages.length > 0 ? (
                        <>
                            {/* Mobile: horizontal scroll */}
                            <div className="scrollbar-thin -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:hidden">
                                {featuredVillages.map((v) => (
                                    <div key={v.id} className="snap-start">
                                        <VillageCard village={v} />
                                    </div>
                                ))}
                            </div>

                            {/* Tablet+: grid */}
                            <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {featuredVillages.map((v) => (
                                    <VillageCard key={v.id} village={v} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div
                            className="rounded-2xl py-16 text-center"
                            style={{ background: 'var(--singgah-green-50)' }}
                        >
                            <Trees
                                className="mx-auto mb-3 h-12 w-12 opacity-30"
                                style={{ color: 'var(--singgah-green-600)' }}
                            />
                            <p className="normal-font-size text-gray-500">
                                Desa pilihan segera hadir.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════
                SECTION 4: JELAJAHI BERDASARKAN WILAYAH
            ══════════════════════════════════════════════════════════════════ */}
            <section
                className="section-padding-x py-16 md:py-20"
                style={{ background: 'var(--singgah-earth-50)' }}
            >
                <div className="container max-w-7xl">
                    <SectionHeader
                        label="🗺️ Wilayah"
                        title="Jelajahi Desa di Seluruh Indonesia"
                        subtitle="Temukan destinasi berdasarkan wilayah favorit Anda"
                    />

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
                        {regions.map((region) => (
                            <Link
                                key={region.name}
                                href={`/explore?wilayah=${encodeURIComponent(region.province)}`}
                                className="region-card group aspect-[4/3]"
                            >
                                {/* Background color per region */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: regionColors[region.image],
                                    }}
                                />
                                {/* Gradient Overlay */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-t ${region.gradient}`}
                                />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-4">
                                    <p
                                        className="small-font-size mb-0.5 font-medium transition-colors"
                                        style={{
                                            color: 'rgba(255,255,255,0.75)',
                                        }}
                                    >
                                        {region.province}
                                    </p>
                                    <h3 className="text-base font-bold leading-tight text-white transition-colors group-hover:text-[var(--singgah-teal-400)] md:text-lg">
                                        {region.name}
                                    </h3>
                                    <p
                                        className="small-font-size mt-1"
                                        style={{
                                            color: 'rgba(255,255,255,0.65)',
                                        }}
                                    >
                                        {region.count} desa
                                    </p>
                                </div>

                                {/* Hover Arrow */}
                                <div
                                    className="absolute right-3 top-3 flex h-7 w-7 scale-90 items-center justify-center rounded-full opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100"
                                    style={{
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(4px)',
                                    }}
                                >
                                    <ArrowRight className="h-3.5 w-3.5 text-white" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════
                SECTION 5: DESA TERBARU
            ══════════════════════════════════════════════════════════════════ */}
            <section className="section-padding-x bg-white py-16 md:py-20">
                <div className="container max-w-7xl">
                    <SectionHeader
                        label="🆕 Terbaru"
                        title="Desa Baru di Platform Kami"
                        subtitle="Baru bergabung dan siap untuk Anda jelajahi"
                        cta="Lihat Semua"
                        ctaHref="/explore?sort=terbaru"
                    />

                    {newVillages.length > 0 ? (
                        <>
                            {/* Mobile: horizontal scroll */}
                            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:hidden">
                                {newVillages.map((v) => (
                                    <div key={v.id} className="snap-start">
                                        <VillageCard village={v} />
                                    </div>
                                ))}
                            </div>

                            {/* Tablet+: grid */}
                            <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {newVillages.map((v) => (
                                    <VillageCard key={v.id} village={v} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div
                            className="rounded-2xl py-16 text-center"
                            style={{ background: 'var(--singgah-green-50)' }}
                        >
                            <Trees
                                className="mx-auto mb-3 h-12 w-12 opacity-30"
                                style={{ color: 'var(--singgah-green-600)' }}
                            />
                            <p className="normal-font-size text-gray-500">
                                Desa terbaru segera hadir.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════
                CTA BANNER — Daftarkan Desa Anda
            ══════════════════════════════════════════════════════════════════ */}
            <section className="section-padding-x hero-gradient relative overflow-hidden py-16 md:py-20">
                {/* Pattern */}
                <div className="absolute inset-0 opacity-[0.05]" aria-hidden>
                    <svg
                        className="h-full w-full"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <pattern
                                id="batik2"
                                x="0"
                                y="0"
                                width="60"
                                height="60"
                                patternUnits="userSpaceOnUse"
                            >
                                <circle
                                    cx="30"
                                    cy="30"
                                    r="14"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1"
                                />
                                <circle
                                    cx="0"
                                    cy="0"
                                    r="6"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="0.75"
                                />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="6"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="0.75"
                                />
                                <line
                                    x1="16"
                                    y1="30"
                                    x2="44"
                                    y2="30"
                                    stroke="white"
                                    strokeWidth="0.5"
                                />
                                <line
                                    x1="30"
                                    y1="16"
                                    x2="30"
                                    y2="44"
                                    stroke="white"
                                    strokeWidth="0.5"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#batik2)" />
                    </svg>
                </div>

                <div className="container relative z-10 max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <span
                            className="small-font-size mb-4 inline-block rounded-full px-4 py-1.5 font-semibold"
                            style={{
                                background: 'rgba(255,255,255,0.12)',
                                color: 'rgba(255,255,255,0.9)',
                                border: '1px solid rgba(255,255,255,0.2)',
                            }}
                        >
                            🏡 Untuk Pengelola Desa
                        </span>
                        <h2
                            className="mb-4 font-extrabold leading-tight text-white"
                            style={{
                                fontFamily: 'var(--font-jakarta)',
                                fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
                            }}
                        >
                            Daftarkan Desa Anda
                            <br />
                            dan Jangkau Lebih Banyak Wisatawan
                        </h2>
                        <p
                            className="normal-font-size mb-8 leading-relaxed"
                            style={{ color: 'rgba(255,255,255,0.75)' }}
                        >
                            Kelola profil desa, unggah konten wisata, dan
                            promosikan potensi lokal Anda kepada ribuan
                            pengunjung Singgah setiap harinya.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <Link
                                href="/register"
                                className="btn-outline-white px-7 py-3.5 text-base"
                            >
                                Daftar Sekarang — Gratis
                            </Link>
                            <Link
                                href="/tentang"
                                className="normal-font-size"
                                style={{ color: 'rgba(255,255,255,0.7)' }}
                            >
                                Pelajari lebih lanjut →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
