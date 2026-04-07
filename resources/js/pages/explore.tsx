import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    SlidersHorizontal,
    ChevronDown,
    X,
    MapPin,
    Star,
    ArrowLeft,
    ArrowRight,
    Check,
} from 'lucide-react';
import { toast } from 'sonner';

import PublicLayout from '@/layouts/PublicLayout';
import VillageCard, {
    type VillageCardData,
} from '@/components/public/VillageCard';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Villages {
    data: VillageCardData[];
    links: PaginationLink[];
    meta: {
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        from: number | null;
        to: number | null;
    };
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number | null;
    to: number | null;
}

interface Filters {
    search: string;
    wilayah: string;
    kategori: string;
    sort: string;
    rating_min: string;
    lat?: number | null;
    lng?: number | null;
}

interface Props {
    villages: Villages;
    filters: Filters;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const wilayahOptions = [
    'Bali',
    'Yogyakarta',
    'Lombok',
    'Jawa Barat',
    'Jawa Tengah',
    'Jawa Timur',
    'Sumatera Utara',
    'Sumatera Barat',
    'Sulawesi Selatan',
    'Nusa Tenggara Timur',
    'Nusa Tenggara Barat',
    'Kalimantan Timur',
    'Papua',
];

const categoryOptions = [
    { value: 'pesisir_bahari', label: 'Pesisir & Bahari' },
    { value: 'agrowisata', label: 'Agrowisata' },
    { value: 'kuliner_lokal', label: 'Kuliner Lokal' },
    { value: 'budaya_tradisi', label: 'Budaya & Tradisi' },
    { value: 'wisata_alam', label: 'Wisata Alam' },
];

const sortOptions = [
    { value: 'terbaru', label: 'Terbaru' },
    { value: 'rating', label: 'Rating Tertinggi' },
    { value: 'nama', label: 'Nama A–Z' },
    { value: 'terdekat', label: '📍 Terdekat Lokasiku (5km)' },
];

// ─── Smart Pagination ─────────────────────────────────────────────────────────

function SmartPagination({
    currentPage,
    lastPage,
    filters,
}: {
    currentPage: number;
    lastPage: number;
    filters: Filters;
}) {
    if (lastPage <= 1) return null;

    const go = (page: number) => {
        router.get(
            '/explore',
            { ...filters, page },
            { preserveState: true, replace: true },
        );
    };

    // Build page numbers with ellipsis
    const pages: (number | '...')[] = [];
    if (lastPage <= 7) {
        for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push('...');
        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(lastPage - 1, currentPage + 1);
            i++
        ) {
            pages.push(i);
        }
        if (currentPage < lastPage - 2) pages.push('...');
        pages.push(lastPage);
    }

    return (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
                disabled={currentPage === 1}
                onClick={() => go(currentPage - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition-colors hover:border-[var(--singgah-green-400)] hover:text-[var(--singgah-green-700)] disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ArrowLeft className="h-4 w-4" />
            </button>

            {pages.map((p, i) =>
                p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-1 text-gray-400">
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => go(p as number)}
                        className={`flex h-9 min-w-[2.25rem] items-center justify-center rounded-xl border px-2 text-sm font-medium transition-colors ${
                            p === currentPage
                                ? 'border-[var(--singgah-green-600)] font-semibold text-white'
                                : 'border-gray-200 text-gray-600 hover:border-[var(--singgah-green-400)]'
                        }`}
                        style={
                            p === currentPage
                                ? { background: 'var(--singgah-green-600)' }
                                : {}
                        }
                    >
                        {p}
                    </button>
                ),
            )}

            <button
                disabled={currentPage === lastPage}
                onClick={() => go(currentPage + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition-colors hover:border-[var(--singgah-green-400)] hover:text-[var(--singgah-green-700)] disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ArrowRight className="h-4 w-4" />
            </button>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Explore({ villages, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [wilayah, setWilayah] = useState(filters.wilayah);
    const [kategori, setKategori] = useState(filters.kategori);
    const [sort, setSort] = useState(filters.sort || 'terbaru');
    const [ratingMin, setRatingMin] = useState(filters.rating_min);
    const [lat, setLat] = useState<number | null>(filters.lat || null);
    const [lng, setLng] = useState<number | null>(filters.lng || null);
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const currentPage =
        villages.current_page ?? villages.meta?.current_page ?? 1;
    const lastPage = villages.last_page ?? villages.meta?.last_page ?? 1;
    const total = villages.total ?? villages.meta?.total ?? 0;

    const applyFilters = (overrides: Partial<Filters> = {}) => {
        router.get(
            '/explore',
            {
                search,
                wilayah,
                kategori,
                sort,
                rating_min: ratingMin,
                lat,
                lng,
                ...overrides,
                page: 1,
            },
            { preserveState: true, replace: true },
        );
    };

    const clearFilter = (key: keyof Filters) => {
        const next = {
            search,
            wilayah,
            kategori,
            sort,
            rating_min: ratingMin,
            lat,
            lng,
            [key]: '',
        };
        if (key === 'search') setSearch('');
        if (key === 'wilayah') setWilayah('');
        if (key === 'kategori') setKategori('');
        if (key === 'rating_min') setRatingMin('');
        applyFilters(next);
    };

    const activeFilterCount = [
        filters.search,
        filters.wilayah,
        filters.kategori,
        filters.rating_min,
    ].filter(Boolean).length;
    const currentFilters: Filters = {
        search,
        wilayah,
        kategori,
        sort,
        rating_min: ratingMin,
        lat,
        lng,
    };

    // Filter panel content (shared between sidebar and bottom sheet)
    const FilterPanel = () => (
        <div className="space-y-6">
            {/* Sort */}
            <div>
                <h3 className="mb-2.5 text-xs font-semibold tracking-widest text-gray-500 uppercase">
                    Urutkan
                </h3>
                <div className="space-y-1">
                    {sortOptions.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                if (opt.value === 'terdekat') {
                                    if (navigator.geolocation) {
                                        toast.loading('Mencari lokasi Anda...', { id: 'geo-loc' });
                                        navigator.geolocation.getCurrentPosition(
                                            (pos) => {
                                                const newLat = pos.coords.latitude;
                                                const newLng = pos.coords.longitude;
                                                setLat(newLat);
                                                setLng(newLng);
                                                setSort(opt.value);
                                                toast.success('Lokasi ditemukan!', { id: 'geo-loc' });
                                                applyFilters({ sort: opt.value, lat: newLat, lng: newLng });
                                            },
                                            (err) => {
                                                console.error(err);
                                                toast.error('Akses lokasi ditolak atau gagal. Pastikan pengaturan browser mengizinkan.', { id: 'geo-loc' });
                                            }
                                        );
                                    } else {
                                        toast.error('Browser ini tidak mendukung deteksi lokasi.');
                                    }
                                } else {
                                    setSort(opt.value);
                                    applyFilters({ sort: opt.value });
                                }
                            }}
                            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                                sort === opt.value
                                    ? 'font-semibold text-white'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                            style={
                                sort === opt.value
                                    ? { background: 'var(--singgah-green-600)' }
                                    : {}
                            }
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Wilayah */}
            <div>
                <h3 className="mb-2.5 text-xs font-semibold tracking-widest text-gray-500 uppercase">
                    Wilayah
                </h3>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-between rounded-xl border-gray-200 px-3 py-2 text-sm font-normal text-gray-900 hover:border-[var(--singgah-green-400)] hover:bg-white"
                        >
                            <span className="truncate">
                                {wilayah || 'Semua Wilayah'}
                            </span>
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        className="max-h-[300px] w-[--radix-dropdown-menu-trigger-width] overflow-y-auto"
                    >
                        <DropdownMenuItem
                            onClick={() => {
                                setWilayah('');
                                applyFilters({ wilayah: '' });
                            }}
                            className="cursor-pointer"
                        >
                            <Check
                                className={`mr-2 h-4 w-4 ${
                                    wilayah === '' ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                            Semua Wilayah
                        </DropdownMenuItem>
                        {wilayahOptions.map((w) => (
                            <DropdownMenuItem
                                key={w}
                                onClick={() => {
                                    setWilayah(w);
                                    applyFilters({ wilayah: w });
                                }}
                                className="cursor-pointer"
                            >
                                <Check
                                    className={`mr-2 h-4 w-4 ${
                                        wilayah === w
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    }`}
                                />
                                {w}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Kategori */}
            <div>
                <h3 className="mb-2.5 text-xs font-semibold tracking-widest text-gray-500 uppercase">
                    Kategori
                </h3>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-between rounded-xl border-gray-200 px-3 py-2 text-sm font-normal text-gray-900 hover:border-[var(--singgah-green-400)] hover:bg-white"
                        >
                            <span className="truncate">
                                {kategori
                                    ? categoryOptions.find(
                                          (c) => c.value === kategori,
                                      )?.label
                                    : 'Semua Kategori'}
                            </span>
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        className="max-h-[300px] w-[--radix-dropdown-menu-trigger-width] overflow-y-auto"
                    >
                        <DropdownMenuItem
                            onClick={() => {
                                setKategori('');
                                applyFilters({ kategori: '' });
                            }}
                            className="cursor-pointer"
                        >
                            <Check
                                className={`mr-2 h-4 w-4 ${
                                    kategori === ''
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                }`}
                            />
                            Semua Kategori
                        </DropdownMenuItem>
                        {categoryOptions.map((cat) => (
                            <DropdownMenuItem
                                key={cat.value}
                                onClick={() => {
                                    setKategori(cat.value);
                                    applyFilters({ kategori: cat.value });
                                }}
                                className="cursor-pointer"
                            >
                                <Check
                                    className={`mr-2 h-4 w-4 ${
                                        kategori === cat.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    }`}
                                />
                                {cat.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Rating minimum */}
            <div>
                <h3 className="mb-2.5 text-xs font-semibold tracking-widest text-gray-500 uppercase">
                    Rating Minimum
                </h3>
                <div className="flex flex-wrap gap-2">
                    {['', '3', '4', '4.5'].map((val) => (
                        <button
                            key={val}
                            type="button"
                            onClick={() => {
                                setRatingMin(val);
                                applyFilters({ rating_min: val });
                            }}
                            className={`flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition-colors ${
                                ratingMin === val
                                    ? 'border-[var(--singgah-green-600)] font-semibold text-white'
                                    : 'border-gray-200 text-gray-600 hover:border-[var(--singgah-green-300)]'
                            }`}
                            style={
                                ratingMin === val
                                    ? { background: 'var(--singgah-green-600)' }
                                    : {}
                            }
                        >
                            {val === '' ? (
                                'Semua'
                            ) : (
                                <>
                                    <Star className="h-3 w-3 fill-current" />
                                    {val}+
                                </>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reset */}
            {activeFilterCount > 0 && (
                <button
                    onClick={() => {
                        setSearch('');
                        setWilayah('');
                        setRatingMin('');
                        router.get(
                            '/explore',
                            { sort, lat, lng },
                            { preserveState: true, replace: true },
                        );
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                    <X className="h-3.5 w-3.5" /> Reset Filter
                </button>
            )}
        </div>
    );

    return (
        <PublicLayout>
            <Head title="Jelajahi Desa Wisata — Singgah" />

            {/* ── Hero strip ── */}
            <section
                className="section-padding-x pt-24 pb-10 md:pt-28"
                style={{ background: 'var(--singgah-green-50)' }}
            >
                <div className="container max-w-7xl">
                    <div
                        className="mb-2 flex items-center gap-2 text-sm"
                        style={{ color: 'var(--singgah-green-600)' }}
                    >
                        <Link href="/" className="hover:underline">
                            Beranda
                        </Link>
                        <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
                        <span className="font-medium">Jelajahi Desa</span>
                    </div>
                    <h1
                        className="mb-4 leading-tight font-extrabold"
                        style={{
                            fontFamily: 'var(--font-jakarta)',
                            fontSize: 'clamp(1.8rem,4vw,2.8rem)',
                            color: 'var(--singgah-green-900)',
                        }}
                    >
                        Jelajahi Desa Wisata Indonesia
                    </h1>

                    {/* Search bar */}
                    <div className="flex max-w-2xl gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && applyFilters()
                                }
                                placeholder="Cari nama desa, wilayah, atau deskripsi..."
                                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pr-4 pl-10 text-sm shadow-sm outline-none focus:border-[var(--singgah-green-400)] focus:ring-2 focus:ring-[var(--singgah-green-100)]"
                            />
                        </div>
                        <button
                            onClick={() => applyFilters()}
                            className="btn-primary shrink-0 px-6"
                        >
                            Cari
                        </button>
                    </div>

                    {/* Active filter chips */}
                    {activeFilterCount > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {filters.wilayah && (
                                <span
                                    className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium shadow-sm"
                                    style={{
                                        border: '1px solid var(--singgah-green-300)',
                                        color: 'var(--singgah-green-700)',
                                    }}
                                >
                                    <MapPin className="h-3 w-3" />{' '}
                                    {filters.wilayah}
                                    <button
                                        onClick={() => clearFilter('wilayah')}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {filters.rating_min && (
                                <span
                                    className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium shadow-sm"
                                    style={{
                                        border: '1px solid var(--singgah-green-300)',
                                        color: 'var(--singgah-green-700)',
                                    }}
                                >
                                    <Star className="h-3 w-3 fill-current" />{' '}
                                    {filters.rating_min}+
                                    <button
                                        onClick={() =>
                                            clearFilter('rating_min')
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {filters.search && (
                                <span
                                    className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium shadow-sm"
                                    style={{
                                        border: '1px solid var(--singgah-green-300)',
                                        color: 'var(--singgah-green-700)',
                                    }}
                                >
                                    "{filters.search}"
                                    <button
                                        onClick={() => clearFilter('search')}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Main content ── */}
            <section className="section-padding-x py-10">
                <div className="container max-w-7xl">
                    {/* Mobile filter button */}
                    <div className="mb-4 flex items-center justify-between lg:hidden">
                        <p className="text-sm text-gray-500">
                            {total} desa ditemukan
                        </p>
                        <button
                            onClick={() => setShowMobileFilter(true)}
                            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filter
                            {activeFilterCount > 0 && (
                                <span
                                    className="flex h-5 w-5 items-center justify-center rounded-full text-xs text-white"
                                    style={{
                                        background: 'var(--singgah-green-600)',
                                    }}
                                >
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="flex gap-8">
                        {/* Sidebar filter — desktop */}
                        <aside className="explore-filter-panel hidden w-60 flex-shrink-0 lg:block">
                            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="font-semibold text-gray-800">
                                        Filter
                                    </h2>
                                    <p className="text-xs text-gray-400">
                                        {total} desa
                                    </p>
                                </div>
                                <FilterPanel />
                            </div>
                        </aside>

                        {/* Grid */}
                        <div className="flex-1">
                            {villages.data.length > 0 ? (
                                <>
                                    <div className="mb-5 hidden items-center justify-between lg:flex">
                                        <p className="text-sm text-gray-500">
                                            Menampilkan{' '}
                                            {villages.from ??
                                                villages.meta?.from}{' '}
                                            – {villages.to ?? villages.meta?.to}{' '}
                                            dari {total} desa
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                        {villages.data.map((v) => (
                                            <VillageCard
                                                key={v.id}
                                                village={v}
                                            />
                                        ))}
                                    </div>
                                    <SmartPagination
                                        currentPage={currentPage}
                                        lastPage={lastPage}
                                        filters={currentFilters}
                                    />
                                </>
                            ) : (
                                <div
                                    className="rounded-2xl py-20 text-center"
                                    style={{
                                        background: 'var(--singgah-green-50)',
                                    }}
                                >
                                    <p className="text-lg font-semibold text-gray-700">
                                        Tidak ada desa ditemukan
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Coba ubah kata kunci atau filter Anda
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearch('');
                                            setWilayah('');
                                            setRatingMin('');
                                            router.get(
                                                '/explore',
                                                { sort },
                                                {
                                                    preserveState: true,
                                                    replace: true,
                                                },
                                            );
                                        }}
                                        className="btn-primary mt-5"
                                    >
                                        Reset pencarian
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile filter bottom sheet */}
            {showMobileFilter && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:hidden"
                    onClick={() => setShowMobileFilter(false)}
                >
                    <div
                        className="w-full rounded-t-3xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxHeight: '85vh', overflowY: 'auto' }}
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Filter</h2>
                            <button onClick={() => setShowMobileFilter(false)}>
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                        <FilterPanel />
                        <button
                            className="btn-primary mt-6 w-full justify-center"
                            onClick={() => setShowMobileFilter(false)}
                        >
                            Tampilkan Hasil
                        </button>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
