import { router, useForm } from '@inertiajs/react';
import { KeyRound, Save, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

import AdminLayout from '@/layouts/AdminLayout';
import PageHeader from '@/components/manager/PageHeader';
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

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
    phone: string | null;
    address: string | null;
    created_at: string;
}
interface Props {
    user: User;
}

const roles = [
    { value: 'user', label: 'Pengguna Biasa' },
    { value: 'manager', label: 'Pengelola Desa' },
    { value: 'admin', label: 'Administrator' },
];

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                {label}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default function AdminUserEdit({ user }: Props) {
    const [roleOpen, setRoleOpen] = useState(false);
    const [pwDialog, setPwDialog] = useState(false);
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [pwError, setPwError] = useState('');
    const [pwProcessing, setPwProcessing] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        role: user.role,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    const handleChangePassword = () => {
        if (!newPw || !confirmPw) {
            setPwError('Kedua field wajib diisi.');
            return;
        }
        if (newPw.length < 8) {
            setPwError('Password minimal 8 karakter.');
            return;
        }
        if (newPw !== confirmPw) {
            setPwError('Konfirmasi password tidak cocok.');
            return;
        }
        setPwError('');
        setPwProcessing(true);
        router.patch(
            `/admin/users/${user.id}/password`,
            { password: newPw, password_confirmation: confirmPw },
            {
                onSuccess: () => {
                    setPwDialog(false);
                    setNewPw('');
                    setConfirmPw('');
                },
                onError: (e) => setPwError(Object.values(e).join(' ')),
                onFinish: () => setPwProcessing(false),
            },
        );
    };

    const selectedRole = roles.find((r) => r.value === data.role);

    return (
        <AdminLayout title={`Edit: ${user.name}`}>
            <PageHeader
                title="Edit Pengguna"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Pengguna', href: '/admin/users' },
                    { label: user.name },
                ]}
            />

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <div className="space-y-5 lg:col-span-2">
                        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="text-xs font-bold tracking-wide text-gray-500 uppercase">
                                Informasi Akun
                            </h3>

                            <Field label="Nama Lengkap" error={errors.name}>
                                <input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                                />
                            </Field>

                            <Field label="Email">
                                <div className="relative">
                                    <input
                                        value={user.email}
                                        disabled
                                        className="w-full cursor-not-allowed rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-gray-400 outline-none"
                                    />
                                    <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-400">
                                        Tidak dapat diubah
                                    </span>
                                </div>
                            </Field>

                            <Field label="Role" error={errors.role}>
                                <DropdownMenu
                                    open={roleOpen}
                                    onOpenChange={setRoleOpen}
                                >
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type="button"
                                            className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-2.5 text-left text-sm transition-colors outline-none hover:border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                        >
                                            <span>
                                                {selectedRole?.label ??
                                                    'Pilih role'}
                                            </span>
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
                                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                        {roles.map((r) => (
                                            <DropdownMenuItem
                                                key={r.value}
                                                onSelect={() => {
                                                    setData('role', r.value);
                                                    setRoleOpen(false);
                                                }}
                                                className={
                                                    data.role === r.value
                                                        ? 'font-semibold text-red-600'
                                                        : ''
                                                }
                                            >
                                                {r.label}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </Field>

                            {/* Warning about admin role */}
                            {data.role === 'admin' && (
                                <div className="flex gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>
                                        Role Administrator memiliki akses penuh
                                        ke seluruh platform. Berikan dengan
                                        bijak.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">
                                Aksi
                            </p>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                            >
                                <Save className="h-4 w-4" />
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Perubahan'}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setPwDialog(true);
                                    setNewPw('');
                                    setConfirmPw('');
                                    setPwError('');
                                }}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                            >
                                <KeyRound className="h-4 w-4" />
                                Ubah Password
                            </button>
                        </div>

                        {/* User Meta */}
                        <div className="space-y-2 rounded-2xl border border-gray-100 bg-white p-5 text-sm shadow-sm">
                            <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
                                Info Akun
                            </p>
                            <p className="text-gray-500">
                                Email:{' '}
                                <span className="font-medium text-gray-800">
                                    {user.email}
                                </span>
                            </p>
                            <p className="text-gray-500">
                                Bergabung:{' '}
                                <span className="font-medium text-gray-800">
                                    {new Date(
                                        user.created_at,
                                    ).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                            </p>
                            {user.phone && (
                                <p className="text-gray-500">
                                    Telepon:{' '}
                                    <span className="font-medium text-gray-800">
                                        {user.phone}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </form>

            {/* Change Password Dialog */}
            <Dialog open={pwDialog} onOpenChange={setPwDialog}>
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <KeyRound className="h-5 w-5 text-red-500" /> Ubah
                            Password
                        </DialogTitle>
                        <DialogDescription>
                            Reset password pengguna <strong>{user.name}</strong>
                            . Pengguna akan perlu login ulang setelah password
                            diubah.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                Password Baru
                            </label>
                            <input
                                type="password"
                                value={newPw}
                                onChange={(e) => setNewPw(e.target.value)}
                                placeholder="Min. 8 karakter"
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                Konfirmasi Password
                            </label>
                            <input
                                type="password"
                                value={confirmPw}
                                onChange={(e) => setConfirmPw(e.target.value)}
                                placeholder="Ulangi password baru"
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                            />
                        </div>
                        {pwError && (
                            <p className="text-xs text-red-500">{pwError}</p>
                        )}
                    </div>
                    <DialogFooter className="flex gap-2 sm:justify-end">
                        <button
                            type="button"
                            onClick={() => setPwDialog(false)}
                            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleChangePassword}
                            disabled={pwProcessing}
                            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                        >
                            <KeyRound className="h-3.5 w-3.5" />
                            {pwProcessing ? 'Menyimpan...' : 'Ubah Password'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
