import { Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Edit2,
    Loader2,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export interface Column<T> {
    key: string;
    label: string;
    render?: (row: T) => React.ReactNode;
    className?: string;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    path: string;
}

interface DataTableProps<T extends { id: number }> {
    columns: Column<T>[];
    data: T[];
    pagination?: PaginationMeta;
    editHref?: (row: T) => string;
    deleteRoute?: (row: T) => string;
    deleteConfirmMessage?: (row: T) => string;
    deleteConfirmTitle?: string;
    emptyMessage?: string;
    loading?: boolean;
}

/** Generate page numbers with `…` gaps — max 7 items on desktop */
function buildPages(current: number, last: number): (number | '…')[] {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

    const pages: (number | '…')[] = [1];

    if (current > 3) pages.push('…');

    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < last - 2) pages.push('…');

    pages.push(last);
    return pages;
}

export default function DataTable<T extends { id: number }>({
    columns,
    data,
    pagination,
    editHref,
    deleteRoute,
    deleteConfirmMessage,
    deleteConfirmTitle = 'Hapus Data?',
    emptyMessage = 'Belum ada data.',
    loading = false,
}: DataTableProps<T>) {
    const [deleting, setDeleting] = useState<number | null>(null);
    const [pendingDelete, setPendingDelete] = useState<T | null>(null);

    const confirmDelete = () => {
        if (!pendingDelete || !deleteRoute) return;
        setDeleting(pendingDelete.id);
        setPendingDelete(null);
        router.delete(deleteRoute(pendingDelete), {
            onFinish: () => setDeleting(null),
        });
    };

    const hasActions = editHref || deleteRoute;
    const pages = pagination
        ? buildPages(pagination.current_page, pagination.last_page)
        : [];

    return (
        <>
            {/* Delete Confirm Dialog */}
            <Dialog
                open={!!pendingDelete}
                onOpenChange={(open) => !open && setPendingDelete(null)}
            >
                <DialogContent className="max-w-sm rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>{deleteConfirmTitle}</DialogTitle>
                        <DialogDescription>
                            {pendingDelete && deleteConfirmMessage
                                ? deleteConfirmMessage(pendingDelete)
                                : 'Data yang dihapus tidak dapat dikembalikan.'}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:justify-end">
                        <button
                            type="button"
                            onClick={() => setPendingDelete(null)}
                            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            disabled={!!deleting}
                            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                        >
                            {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="w-full space-y-3">
                {/* ── Table with horizontal scroll on all sizes ── */}
                <div className="w-full max-w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[600px] text-sm">
                            <thead>
                                <tr
                                    className="border-b border-gray-100"
                                    style={{
                                        background: 'var(--singgah-green-50)',
                                    }}
                                >
                                    {columns.map((col) => (
                                        <th
                                            key={col.key}
                                            className={`px-5 py-3.5 text-left text-xs font-bold tracking-wider whitespace-nowrap text-gray-500 uppercase ${col.className ?? ''}`}
                                        >
                                            {col.label}
                                        </th>
                                    ))}
                                    {hasActions && (
                                        <th className="px-5 py-3.5 text-right text-xs font-bold tracking-wider whitespace-nowrap text-gray-500 uppercase">
                                            Aksi
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={
                                                columns.length +
                                                (hasActions ? 1 : 0)
                                            }
                                            className="py-12 text-center text-gray-400"
                                        >
                                            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                        </td>
                                    </tr>
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={
                                                columns.length +
                                                (hasActions ? 1 : 0)
                                            }
                                            className="py-12 text-center text-sm text-gray-400"
                                        >
                                            {emptyMessage}
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((row, i) => (
                                        <tr
                                            key={row.id}
                                            className={`border-b border-gray-50 transition-colors hover:bg-gray-50/80 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
                                        >
                                            {columns.map((col) => (
                                                <td
                                                    key={col.key}
                                                    className={`px-5 py-3.5 text-gray-700 ${col.className ?? ''}`}
                                                >
                                                    {col.render
                                                        ? col.render(row)
                                                        : String(
                                                              (row as any)[
                                                                  col.key
                                                              ] ?? '—',
                                                          )}
                                                </td>
                                            ))}
                                            {hasActions && (
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {editHref && (
                                                            <Link
                                                                href={editHref(
                                                                    row,
                                                                )}
                                                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-(--singgah-green-700) transition-colors hover:bg-(--singgah-green-50)"
                                                            >
                                                                <Edit2 className="h-3.5 w-3.5" />
                                                                Edit
                                                            </Link>
                                                        )}
                                                        {deleteRoute && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setPendingDelete(
                                                                        row,
                                                                    )
                                                                }
                                                                disabled={
                                                                    deleting ===
                                                                    row.id
                                                                }
                                                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                                                            >
                                                                {deleting ===
                                                                row.id ? (
                                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                )}
                                                                Hapus
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Smart Pagination ── */}
                {pagination && pagination.last_page > 1 && (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        {/* Summary */}
                        <p className="text-center text-xs text-gray-500 sm:text-left">
                            {pagination.from && pagination.to
                                ? `Menampilkan ${pagination.from}–${pagination.to} dari ${pagination.total} data`
                                : `Halaman ${pagination.current_page} dari ${pagination.last_page}`}
                        </p>

                        {/* Mobile: prev / "X dari Y" / next (compact, no overflow) */}
                        <div className="flex items-center justify-center gap-1 sm:hidden">
                            <Link
                                href={`${pagination.path}?page=${pagination.current_page - 1}`}
                                aria-disabled={pagination.current_page === 1}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs transition-colors ${
                                    pagination.current_page === 1
                                        ? 'pointer-events-none border-gray-100 text-gray-300'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </Link>
                            <span className="px-3 text-xs font-medium text-gray-600">
                                {pagination.current_page} /{' '}
                                {pagination.last_page}
                            </span>
                            <Link
                                href={`${pagination.path}?page=${pagination.current_page + 1}`}
                                aria-disabled={
                                    pagination.current_page ===
                                    pagination.last_page
                                }
                                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs transition-colors ${
                                    pagination.current_page ===
                                    pagination.last_page
                                        ? 'pointer-events-none border-gray-100 text-gray-300'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        {/* Desktop: full page buttons + dots */}
                        <div className="hidden items-center gap-1 sm:flex">
                            <Link
                                href={`${pagination.path}?page=${pagination.current_page - 1}`}
                                aria-disabled={pagination.current_page === 1}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs transition-colors ${
                                    pagination.current_page === 1
                                        ? 'pointer-events-none border-gray-100 text-gray-300'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </Link>

                            {pages.map((p, idx) =>
                                p === '…' ? (
                                    <span
                                        key={`dots-${idx}`}
                                        className="flex h-8 w-8 items-center justify-center text-xs text-gray-400"
                                    >
                                        …
                                    </span>
                                ) : (
                                    <Link
                                        key={p}
                                        href={`${pagination.path}?page=${p}`}
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-medium transition-colors ${
                                            p === pagination.current_page
                                                ? 'border-transparent text-white'
                                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                        style={
                                            p === pagination.current_page
                                                ? {
                                                      background:
                                                          'var(--singgah-green-600)',
                                                  }
                                                : undefined
                                        }
                                    >
                                        {p}
                                    </Link>
                                ),
                            )}

                            <Link
                                href={`${pagination.path}?page=${pagination.current_page + 1}`}
                                aria-disabled={
                                    pagination.current_page ===
                                    pagination.last_page
                                }
                                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs transition-colors ${
                                    pagination.current_page ===
                                    pagination.last_page
                                        ? 'pointer-events-none border-gray-100 text-gray-300'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
