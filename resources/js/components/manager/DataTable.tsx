import { Link, router } from '@inertiajs/react';
import { Edit2, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';

export interface Column<T> {
    key: string;
    label: string;
    render?: (row: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T extends { id: number }> {
    columns: Column<T>[];
    data: T[];
    editHref?: (row: T) => string;
    deleteRoute?: (row: T) => string;
    deleteConfirmMessage?: (row: T) => string;
    emptyMessage?: string;
    loading?: boolean;
}

export default function DataTable<T extends { id: number }>({
    columns,
    data,
    editHref,
    deleteRoute,
    deleteConfirmMessage,
    emptyMessage = 'Belum ada data.',
    loading = false,
}: DataTableProps<T>) {
    const [deleting, setDeleting] = useState<number | null>(null);

    const handleDelete = (row: T) => {
        const msg = deleteConfirmMessage
            ? deleteConfirmMessage(row)
            : 'Yakin ingin menghapus?';
        if (!confirm(msg)) return;
        setDeleting(row.id);
        router.delete(deleteRoute!(row), {
            onFinish: () => setDeleting(null),
        });
    };

    const hasActions = editHref || deleteRoute;

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr
                            className="border-b border-gray-100"
                            style={{ background: 'var(--singgah-green-50)' }}
                        >
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-5 py-3.5 text-left text-xs font-bold tracking-wider text-gray-500 uppercase ${col.className ?? ''}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                            {hasActions && (
                                <th className="px-5 py-3.5 text-right text-xs font-bold tracking-wider text-gray-500 uppercase">
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
                                        columns.length + (hasActions ? 1 : 0)
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
                                        columns.length + (hasActions ? 1 : 0)
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
                                    className={`border-b border-gray-50 transition-colors hover:bg-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`px-5 py-3.5 text-gray-700 ${col.className ?? ''}`}
                                        >
                                            {col.render
                                                ? col.render(row)
                                                : String(
                                                      (row as any)[col.key] ??
                                                          '—',
                                                  )}
                                        </td>
                                    ))}
                                    {hasActions && (
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center justify-end gap-2">
                                                {editHref && (
                                                    <Link
                                                        href={editHref(row)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--singgah-green-700)] transition-colors hover:bg-[var(--singgah-green-50)]"
                                                    >
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                        Edit
                                                    </Link>
                                                )}
                                                {deleteRoute && (
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(row)
                                                        }
                                                        disabled={
                                                            deleting === row.id
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        {deleting === row.id ? (
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
    );
}
