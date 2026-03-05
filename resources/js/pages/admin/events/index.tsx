import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
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

interface Event {
    id: number;
    name: string;
    event_date: string;
    location: string | null;
    is_featured: boolean;
    village: { name: string } | null;
}
interface Village {
    id: number;
    name: string;
}
interface Props {
    events: { data: Event[] } & PaginationMeta;
    villages: Village[];
    filters: { search?: string; village_id?: string };
}

const columns: Column<Event>[] = [
    {
        key: 'name',
        label: 'Nama Acara',
        render: (row) => (
            <div>
                <p className="font-semibold text-gray-800">{row.name}</p>
                <p className="text-xs text-gray-400">
                    {row.village?.name ?? '—'}
                </p>
            </div>
        ),
    },
    {
        key: 'event_date',
        label: 'Tanggal',
        render: (row) =>
            new Date(row.event_date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            }),
    },
    { key: 'location', label: 'Lokasi', render: (row) => row.location ?? '—' },
    {
        key: 'is_featured',
        label: 'Unggulan',
        render: (row) =>
            row.is_featured ? (
                <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
                    ⭐ Ya
                </span>
            ) : (
                <span className="text-xs text-gray-400">—</span>
            ),
    },
];

export default function AdminEventsIndex({ events, villages, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [villageId, setVillage] = useState(filters.village_id ?? '');

    const applyFilters = (overrides: Record<string, string> = {}) => {
        router.get(
            '/admin/events',
            { search, village_id: villageId, ...overrides },
            { preserveState: true, replace: true },
        );
    };

    const { data, ...pagination } = events;

    return (
        <AdminLayout title="Acara">
            <PageHeader
                title="Manajemen Acara"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Acara' },
                ]}
            />

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        placeholder="Cari nama acara..."
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
                                {villages.find(
                                    (v) => String(v.id) === villageId,
                                )?.name ?? 'Semua Desa'}
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
                        <DropdownMenuContent className="max-h-60 overflow-y-auto">
                            <DropdownMenuItem
                                onSelect={() => {
                                    setVillage('');
                                    applyFilters({ village_id: '' });
                                }}
                                className={
                                    villageId === ''
                                        ? 'font-semibold text-red-600'
                                        : ''
                                }
                            >
                                Semua Desa
                            </DropdownMenuItem>
                            {villages.map((v) => (
                                <DropdownMenuItem
                                    key={v.id}
                                    onSelect={() => {
                                        setVillage(String(v.id));
                                        applyFilters({
                                            village_id: String(v.id),
                                        });
                                    }}
                                    className={
                                        villageId === String(v.id)
                                            ? 'font-semibold text-red-600'
                                            : ''
                                    }
                                >
                                    {v.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <button
                        onClick={() => applyFilters()}
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
                editHref={(row) => `/admin/events/${row.id}/edit`}
                deleteRoute={(row) => `/admin/events/${row.id}`}
                deleteConfirmTitle="Hapus Acara?"
                deleteConfirmMessage={(row) =>
                    `Yakin ingin menghapus acara "${row.name}"?`
                }
                emptyMessage="Tidak ada acara ditemukan."
            />
        </AdminLayout>
    );
}
