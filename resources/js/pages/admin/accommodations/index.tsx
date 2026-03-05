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

interface Accommodation {
    id: number;
    name: string;
    location: string | null;
    price_min: number | null;
    price_max: number | null;
    village: { name: string } | null;
}
interface Village {
    id: number;
    name: string;
}
interface Props {
    accommodations: { data: Accommodation[] } & PaginationMeta;
    villages: Village[];
    filters: { search?: string; village_id?: string };
}

const fmt = (n: number | null) =>
    n != null ? `Rp${n.toLocaleString('id-ID')}` : '—';
const columns: Column<Accommodation>[] = [
    {
        key: 'name',
        label: 'Akomodasi',
        render: (r) => (
            <div>
                <p className="font-semibold text-gray-800">{r.name}</p>
                <p className="text-xs text-gray-400">
                    {r.village?.name ?? '—'}
                </p>
            </div>
        ),
    },
    { key: 'location', label: 'Lokasi', render: (r) => r.location ?? '—' },
    {
        key: 'price',
        label: 'Harga/malam',
        render: (r) => `${fmt(r.price_min)} – ${fmt(r.price_max)}`,
    },
];

export default function AdminAccommodationsIndex({
    accommodations,
    villages,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [villageId, setVillage] = useState(filters.village_id ?? '');
    const apply = (overrides: Record<string, string> = {}) =>
        router.get(
            '/admin/accommodations',
            { search, village_id: villageId, ...overrides },
            { preserveState: true, replace: true },
        );
    const { data, ...pagination } = accommodations;

    return (
        <AdminLayout title="Akomodasi">
            <PageHeader
                title="Manajemen Akomodasi"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Akomodasi' },
                ]}
            />
            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && apply()}
                        placeholder="Cari nama akomodasi..."
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
                                    apply({ village_id: '' });
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
                                        apply({ village_id: String(v.id) });
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
                editHref={(r) => `/admin/accommodations/${r.id}/edit`}
                deleteRoute={(r) => `/admin/accommodations/${r.id}`}
                deleteConfirmTitle="Hapus Akomodasi?"
                deleteConfirmMessage={(r) =>
                    `Yakin ingin menghapus akomodasi "${r.name}"?`
                }
                emptyMessage="Tidak ada akomodasi ditemukan."
            />
        </AdminLayout>
    );
}
