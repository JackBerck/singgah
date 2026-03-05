import { router } from '@inertiajs/react';
import {
    CheckCircle2,
    MapPin,
    Search,
    Star,
    StarOff,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

import AdminLayout from '@/layouts/AdminLayout';
import PageHeader from '@/components/manager/PageHeader';
import DataTable, {
    type Column,
    type PaginationMeta,
} from '@/components/manager/DataTable';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Village {
    id: number;
    name: string;
    slug: string;
    status: string;
    is_featured: boolean;
    address: string | null;
    short_description: string | null;
    manager: { name: string; email: string } | null;
    events_count: number;
    attractions_count: number;
    culinaries_count: number;
    accommodations_count: number;
    created_at: string;
}
interface Props {
    villages: { data: Village[] } & PaginationMeta;
    filters: { search?: string; status?: string };
}

const statusBadge: Record<string, string> = {
    verified: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-700',
};
const statusLabel: Record<string, string> = {
    verified: 'Terverifikasi',
    pending: 'Menunggu',
    rejected: 'Ditolak',
};
const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'verified', label: 'Terverifikasi' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'rejected', label: 'Ditolak' },
];

export default function VillagesIndex({ villages, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [statusOpen, setStatusOpen] = useState(false);
    const [verifyTarget, setVerifyTarget] = useState<Village | null>(null);
    const [verifying, setVerifying] = useState(false);
    const [rejectTarget, setRejectTarget] = useState<Village | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [rejecting, setRejecting] = useState(false);

    const applyFilters = (overrides: Record<string, string> = {}) => {
        router.get(
            '/admin/villages',
            { search, status, ...overrides },
            { preserveState: true, replace: true },
        );
    };

    const handleVerify = () => {
        if (!verifyTarget) return;
        setVerifying(true);
        router.patch(
            `/admin/villages/${verifyTarget.id}/verify`,
            {},
            {
                onFinish: () => {
                    setVerifying(false);
                    setVerifyTarget(null);
                },
            },
        );
    };

    const handleReject = () => {
        if (!rejectTarget || rejectReason.length < 10) return;
        setRejecting(true);
        router.patch(
            `/admin/villages/${rejectTarget.id}/reject`,
            { rejected_reason: rejectReason },
            {
                onFinish: () => {
                    setRejecting(false);
                    setRejectTarget(null);
                    setRejectReason('');
                },
            },
        );
    };

    const handleToggleFeatured = (v: Village) =>
        router.patch(`/admin/villages/${v.id}/toggle-featured`);

    const columns: Column<Village>[] = [
        {
            key: 'name',
            label: 'Desa',
            render: (row) => (
                <div>
                    <p className="font-semibold text-gray-800">{row.name}</p>
                    <p className="text-xs text-gray-400">
                        {row.manager?.name ?? 'Tanpa pengelola'}
                    </p>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge[row.status] ?? 'bg-gray-100 text-gray-600'}`}
                >
                    {statusLabel[row.status] ?? row.status}
                </span>
            ),
        },
        {
            key: 'konten',
            label: 'Konten',
            render: (row) => (
                <span className="text-xs text-gray-500">
                    {(row.events_count ?? 0) +
                        (row.attractions_count ?? 0) +
                        (row.culinaries_count ?? 0) +
                        (row.accommodations_count ?? 0)}{' '}
                    item
                </span>
            ),
        },
        {
            key: 'aksi_cepat',
            label: '',
            render: (row) => (
                <div className="flex items-center gap-1">
                    {row.status !== 'verified' && (
                        <button
                            onClick={() => setVerifyTarget(row)}
                            className="flex items-center gap-1 rounded-lg bg-emerald-500 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-600"
                        >
                            <CheckCircle2 className="h-3 w-3" /> Verifikasi
                        </button>
                    )}
                    {row.status !== 'rejected' && (
                        <button
                            onClick={() => {
                                setRejectTarget(row);
                                setRejectReason('');
                            }}
                            className="flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                            <XCircle className="h-3 w-3" /> Tolak
                        </button>
                    )}
                    <button
                        onClick={() => handleToggleFeatured(row)}
                        title={
                            row.is_featured
                                ? 'Hapus dari unggulan'
                                : 'Jadikan unggulan'
                        }
                        className={`rounded-lg p-1.5 transition-colors ${row.is_featured ? 'text-yellow-500 hover:bg-yellow-50' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        {row.is_featured ? (
                            <Star className="h-3.5 w-3.5 fill-yellow-400" />
                        ) : (
                            <StarOff className="h-3.5 w-3.5" />
                        )}
                    </button>
                </div>
            ),
        },
    ];

    const { data, ...pagination } = villages;
    const selectedStatus =
        statusOptions.find((s) => s.value === status) ?? statusOptions[0];

    return (
        <AdminLayout title="Desa">
            <PageHeader
                title="Manajemen Desa"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Desa' },
                ]}
            />

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        placeholder="Cari nama desa atau alamat..."
                        className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-9 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    />
                </div>
                <div className="flex gap-2">
                    <DropdownMenu
                        open={statusOpen}
                        onOpenChange={setStatusOpen}
                    >
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none hover:border-gray-300"
                            >
                                {selectedStatus.label}
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
                            {statusOptions.map((opt) => (
                                <DropdownMenuItem
                                    key={opt.value}
                                    onSelect={() => {
                                        setStatus(opt.value);
                                        setStatusOpen(false);
                                        applyFilters({ status: opt.value });
                                    }}
                                    className={
                                        status === opt.value
                                            ? 'font-semibold text-red-600'
                                            : ''
                                    }
                                >
                                    {opt.label}
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
                editHref={(row) => `/admin/villages/${row.id}/edit`}
                deleteRoute={(row) => `/admin/villages/${row.id}`}
                deleteConfirmTitle="Hapus Desa?"
                deleteConfirmMessage={(row) =>
                    `Menghapus desa "${row.name}" akan menghapus semua konten, ulasan, dan media yang terkait secara permanen.`
                }
                emptyMessage="Tidak ada desa ditemukan."
            />

            {/* VERIFY DIALOG */}
            <Dialog
                open={!!verifyTarget}
                onOpenChange={(open) => !open && setVerifyTarget(null)}
            >
                <DialogContent className="max-w-lg rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-emerald-700">
                            <CheckCircle2 className="h-5 w-5" /> Verifikasi Desa
                        </DialogTitle>
                        <DialogDescription>
                            Tinjau informasi desa sebelum memverifikasi. Desa
                            yang terverifikasi akan tampil publik di platform.
                        </DialogDescription>
                    </DialogHeader>
                    {verifyTarget && (
                        <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <div>
                                <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
                                    Nama Desa
                                </p>
                                <p className="font-semibold text-gray-800">
                                    {verifyTarget.name}
                                </p>
                            </div>
                            {verifyTarget.address && (
                                <div className="flex items-start gap-2">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                    <div>
                                        <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
                                            Alamat
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {verifyTarget.address}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {verifyTarget.short_description && (
                                <div>
                                    <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
                                        Deskripsi
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {verifyTarget.short_description}
                                    </p>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
                                        Pengelola
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        {verifyTarget.manager?.name ?? '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
                                        Total Konten
                                    </p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {(verifyTarget.events_count ?? 0) +
                                            (verifyTarget.attractions_count ??
                                                0) +
                                            (verifyTarget.culinaries_count ??
                                                0) +
                                            (verifyTarget.accommodations_count ??
                                                0)}{' '}
                                        item
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
                                        Didaftarkan
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        {new Date(
                                            verifyTarget.created_at,
                                        ).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="flex gap-2 sm:justify-end">
                        <button
                            type="button"
                            onClick={() => setVerifyTarget(null)}
                            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleVerify}
                            disabled={verifying}
                            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            {verifying
                                ? 'Memverifikasi...'
                                : 'Verifikasi Sekarang'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* REJECT DIALOG */}
            <Dialog
                open={!!rejectTarget}
                onOpenChange={(open) => !open && setRejectTarget(null)}
            >
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Tolak Desa</DialogTitle>
                        <DialogDescription>
                            Berikan alasan penolakan untuk desa{' '}
                            <strong>{rejectTarget?.name}</strong>. Alasan ini
                            akan terlihat oleh pengelola desa.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={4}
                            placeholder="Tuliskan alasan penolakan yang jelas dan konstruktif..."
                            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        />
                        {rejectReason.length > 0 &&
                            rejectReason.length < 10 && (
                                <p className="mt-1 text-xs text-red-500">
                                    Minimal 10 karakter
                                </p>
                            )}
                    </div>
                    <DialogFooter className="flex gap-2 sm:justify-end">
                        <button
                            type="button"
                            onClick={() => setRejectTarget(null)}
                            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleReject}
                            disabled={rejecting || rejectReason.length < 10}
                            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                        >
                            {rejecting ? 'Menolak...' : 'Tolak Desa'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
