import { router } from '@inertiajs/react';
import { Search, Star } from 'lucide-react';
import { useState } from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu';

import AdminLayout from '@/layouts/AdminLayout';
import PageHeader from '@/components/manager/PageHeader';
import DataTable, {
    type Column,
    type PaginationMeta,
} from '@/components/manager/DataTable';

interface Review {
    id: number;
    rating: number;
    comment: string | null;
    user: { name: string; email: string } | null;
    reviewable: { name: string } | null;
    created_at: string;
}
interface Props {
    reviews: { data: Review[] } & PaginationMeta;
    filters: { search?: string; rating?: string };
}

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                />
            ))}
            <span className="ml-1 text-xs text-gray-500">{rating}/5</span>
        </div>
    );
}

const columns: Column<Review>[] = [
    {
        key: 'user',
        label: 'Pengguna',
        render: (r) => (
            <div>
                <p className="font-semibold text-gray-800">
                    {r.user?.name ?? 'Anonim'}
                </p>
                <p className="text-xs text-gray-400">{r.user?.email ?? '—'}</p>
            </div>
        ),
    },
    {
        key: 'reviewable',
        label: 'Untuk',
        render: (r) => (
            <span className="text-sm text-gray-700">
                {r.reviewable?.name ?? '—'}
            </span>
        ),
    },
    {
        key: 'rating',
        label: 'Rating',
        render: (r) => <Stars rating={r.rating} />,
    },
    {
        key: 'comment',
        label: 'Komentar',
        render: (r) => (
            <p className="max-w-xs truncate text-sm text-gray-600">
                {r.comment ?? '—'}
            </p>
        ),
    },
    {
        key: 'created_at',
        label: 'Tanggal',
        render: (r) =>
            new Date(r.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            }),
    },
];

export default function AdminReviewsIndex({ reviews, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [rating, setRating] = useState(filters.rating ?? '');

    const apply = (overrides: Record<string, string> = {}) =>
        router.get(
            '/admin/reviews',
            { search, rating, ...overrides },
            { preserveState: true, replace: true },
        );

    const { data, ...pagination } = reviews;

    return (
        <AdminLayout title="Ulasan">
            <PageHeader
                title="Manajemen Ulasan"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Ulasan' },
                ]}
            />

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && apply()}
                        placeholder="Cari nama pengguna atau komentar..."
                        className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-9 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    />
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none hover:border-gray-300"
                            >
                                {rating
                                    ? `${'⭐'.repeat(Number(rating))} (${rating})`
                                    : 'Semua Rating'}
                                <svg
                                    className="h-4 w-4 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onSelect={() => {
                                    setRating('');
                                    apply({ rating: '' });
                                }}
                                className={
                                    rating === ''
                                        ? 'font-semibold text-red-600'
                                        : ''
                                }
                            >
                                Semua Rating
                            </DropdownMenuItem>
                            {[5, 4, 3, 2, 1].map((r) => (
                                <DropdownMenuItem
                                    key={r}
                                    onSelect={() => {
                                        setRating(String(r));
                                        apply({ rating: String(r) });
                                    }}
                                    className={
                                        rating === String(r)
                                            ? 'font-semibold text-red-600'
                                            : ''
                                    }
                                >
                                    {'⭐'.repeat(r)} ({r})
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <button
                        onClick={() => apply()}
                        className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Cari
                    </button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={data}
                pagination={pagination as PaginationMeta}
                deleteRoute={(r) => `/admin/reviews/${r.id}`}
                deleteConfirmTitle="Hapus Ulasan?"
                deleteConfirmMessage={() =>
                    'Ulasan yang dihapus tidak dapat dikembalikan.'
                }
                emptyMessage="Tidak ada ulasan ditemukan."
            />
        </AdminLayout>
    );
}
