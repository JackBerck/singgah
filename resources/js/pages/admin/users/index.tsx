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

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}
interface Props {
    users: { data: User[] } & PaginationMeta;
    filters: { search?: string; role?: string };
}

const roleBadge: Record<string, string> = {
    admin: 'bg-red-100 text-red-700',
    manager: 'bg-emerald-100 text-emerald-700',
    user: 'bg-blue-100 text-blue-700',
};
const roleLabel: Record<string, string> = {
    admin: 'Admin',
    manager: 'Pengelola',
    user: 'Pengguna',
};

const columns: Column<User>[] = [
    {
        key: 'name',
        label: 'Nama',
        render: (row) => (
            <div>
                <p className="font-semibold text-gray-800">{row.name}</p>
                <p className="text-xs text-gray-400">{row.email}</p>
            </div>
        ),
    },
    {
        key: 'role',
        label: 'Role',
        render: (row) => (
            <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleBadge[row.role] ?? 'bg-gray-100 text-gray-600'}`}
            >
                {roleLabel[row.role] ?? row.role}
            </span>
        ),
    },
    {
        key: 'created_at',
        label: 'Bergabung',
        render: (row) =>
            new Date(row.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            }),
    },
];

const roleOptions = [
    { value: '', label: 'Semua Role' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Pengelola' },
    { value: 'user', label: 'Pengguna' },
];

export default function UsersIndex({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole] = useState(filters.role ?? '');
    const [roleOpen, setRoleOpen] = useState(false);

    const applyFilters = (overrides: Record<string, string> = {}) => {
        router.get(
            '/admin/users',
            { search, role, ...overrides },
            { preserveState: true, replace: true },
        );
    };

    const { data, ...pagination } = users;
    const selectedRole =
        roleOptions.find((r) => r.value === role) ?? roleOptions[0];

    return (
        <AdminLayout title="Pengguna">
            <PageHeader
                title="Manajemen Pengguna"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Pengguna' },
                ]}
            />

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        placeholder="Cari nama atau email..."
                        className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-9 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    />
                </div>
                <div className="flex gap-2">
                    <DropdownMenu open={roleOpen} onOpenChange={setRoleOpen}>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none hover:border-gray-300"
                            >
                                {selectedRole.label}
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
                            {roleOptions.map((opt) => (
                                <DropdownMenuItem
                                    key={opt.value}
                                    onSelect={() => {
                                        setRole(opt.value);
                                        setRoleOpen(false);
                                        applyFilters({ role: opt.value });
                                    }}
                                    className={
                                        role === opt.value
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
                editHref={(row) => `/admin/users/${row.id}/edit`}
                deleteRoute={(row) => `/admin/users/${row.id}`}
                deleteConfirmTitle="Hapus Pengguna?"
                deleteConfirmMessage={(row) =>
                    `Yakin ingin menghapus pengguna "${row.name}"? Aksi ini tidak dapat dibatalkan.`
                }
                emptyMessage="Tidak ada pengguna ditemukan."
            />
        </AdminLayout>
    );
}
