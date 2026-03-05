import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    User,
    ShieldCheck,
    Star,
    MapPin,
    Calendar,
    Trash2,
    Loader2,
    Upload,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PublicLayout from '@/layouts/PublicLayout';
import StarRating from '@/components/public/StarRating';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Review {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    reviewable: {
        id: number;
        name: string;
        slug?: string;
    } | null;
    reviewable_type: string;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    avatar: string | null;
    role: string;
    reviews: Review[];
}

interface Props {
    user: AuthUser;
}

type Tab = 'akun' | 'keamanan' | 'ulasan';

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Profil({ user }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('akun');

    // Akun form
    const [name, setName] = useState(user.name);
    const [phone, setPhone] = useState(user.phone ?? '');
    const [address, setAddress] = useState(user.address ?? '');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        user.avatar ? `/storage/${user.avatar}` : null,
    );
    const [savingProfile, setSavingProfile] = useState(false);

    // Password form
    const [currentPwd, setCurrentPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [savingPwd, setSavingPwd] = useState(false);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Ukuran avatar maksimal 2MB.');
            return;
        }
        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const saveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);

        const fd = new FormData();
        fd.append('name', name);
        fd.append('phone', phone);
        fd.append('address', address);
        if (avatar) fd.append('avatar', avatar);
        fd.append('_method', 'POST');

        router.post('/profil', fd, {
            forceFormData: true,
            onSuccess: () => toast.success('Profil berhasil diperbarui.'),
            onError: (errs) => {
                const msg = Object.values(errs)[0] as string;
                toast.error(msg || 'Gagal memperbarui profil.');
            },
            onFinish: () => setSavingProfile(false),
        });
    };

    const savePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPwd !== confirmPwd) {
            toast.error('Konfirmasi kata sandi tidak cocok.');
            return;
        }
        setSavingPwd(true);
        router.put(
            '/profil/password',
            {
                current_password: currentPwd,
                password: newPwd,
                password_confirmation: confirmPwd,
            },
            {
                onSuccess: () => {
                    toast.success('Kata sandi berhasil diubah.');
                    setCurrentPwd('');
                    setNewPwd('');
                    setConfirmPwd('');
                },
                onError: (errs) => {
                    const msg = Object.values(errs)[0] as string;
                    toast.error(msg || 'Gagal mengubah kata sandi.');
                },
                onFinish: () => setSavingPwd(false),
            },
        );
    };

    const deleteReview = (id: number) => {
        router.delete(`/reviews/${id}`, {
            onSuccess: () => toast.success('Ulasan dihapus.'),
        });
    };

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        {
            id: 'akun',
            label: 'Informasi Akun',
            icon: <User className="h-4 w-4" />,
        },
        {
            id: 'keamanan',
            label: 'Keamanan',
            icon: <ShieldCheck className="h-4 w-4" />,
        },
        {
            id: 'ulasan',
            label: `Ulasan Saya (${user.reviews.length})`,
            icon: <Star className="h-4 w-4" />,
        },
    ];

    return (
        <PublicLayout>
            <Head title="Profil Saya — Singgah" />

            {/* Header */}
            <div className="section-padding-x hero-gradient pt-24 pb-10">
                <div className="container max-w-4xl">
                    <div className="flex items-center gap-5">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white/60 shadow-lg">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className="flex h-full w-full items-center justify-center text-2xl font-bold text-white"
                                        style={{
                                            background:
                                                'var(--singgah-teal-600)',
                                        }}
                                    >
                                        {user.name[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h1
                                className="text-xl font-bold text-white"
                                style={{ fontFamily: 'var(--font-jakarta)' }}
                            >
                                {user.name}
                            </h1>
                            <p
                                className="text-sm"
                                style={{ color: 'rgba(255,255,255,0.75)' }}
                            >
                                {user.email}
                            </p>
                            <span
                                className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                style={{
                                    background: 'rgba(255,255,255,0.15)',
                                    color: 'rgba(255,255,255,0.9)',
                                }}
                            >
                                {user.role === 'admin'
                                    ? '🛡️ Admin'
                                    : user.role === 'manager'
                                      ? '🏡 Pengelola'
                                      : '👤 Pengunjung'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <section className="section-padding-x py-8">
                <div className="container max-w-4xl">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start">
                        {/* Sidebar tabs */}
                        <aside className="w-full flex-shrink-0 md:w-52">
                            <nav className="space-y-1 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
                                {tabs.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setActiveTab(t.id)}
                                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                                            activeTab === t.id
                                                ? 'text-white'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                        style={
                                            activeTab === t.id
                                                ? {
                                                      background:
                                                          'var(--singgah-green-600)',
                                                  }
                                                : {}
                                        }
                                    >
                                        {t.icon} {t.label}
                                    </button>
                                ))}

                                <div className="mt-1 border-t border-gray-100 pt-1">
                                    {user.role === 'manager' && (
                                        <Link
                                            href="/manager"
                                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                                        >
                                            🏡 Dashboard Pengelola
                                        </Link>
                                    )}
                                    {user.role === 'admin' && (
                                        <Link
                                            href="/admin"
                                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                                        >
                                            🛡️ Dashboard Admin
                                        </Link>
                                    )}
                                </div>
                            </nav>
                        </aside>

                        {/* Main content */}
                        <div className="min-w-0 flex-1">
                            {/* Tab: Akun */}
                            {activeTab === 'akun' && (
                                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                    <h2 className="mb-5 font-semibold text-gray-800">
                                        Informasi Akun
                                    </h2>
                                    <form
                                        onSubmit={saveProfile}
                                        className="space-y-5"
                                    >
                                        {/* Avatar upload */}
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Foto Profil
                                            </Label>
                                            <div className="mt-2 flex items-center gap-4">
                                                <div className="h-16 w-16 overflow-hidden rounded-full border border-gray-200">
                                                    {avatarPreview ? (
                                                        <img
                                                            src={avatarPreview}
                                                            alt="avatar"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="flex h-full w-full items-center justify-center text-xl font-bold text-white"
                                                            style={{
                                                                background:
                                                                    'var(--singgah-teal-600)',
                                                            }}
                                                        >
                                                            {user.name[0].toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                                                    <Upload className="h-4 w-4" />
                                                    Ubah Foto
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={
                                                            handleAvatarChange
                                                        }
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label
                                                htmlFor="name"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Nama Lengkap
                                            </Label>
                                            <Input
                                                id="name"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                className="focus-visible:ring-[var(--singgah-green-600)]"
                                            />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label className="text-sm font-medium text-gray-700">
                                                Email
                                            </Label>
                                            <Input
                                                value={user.email}
                                                disabled
                                                className="cursor-not-allowed bg-gray-50 text-gray-400"
                                            />
                                            <p className="text-xs text-gray-400">
                                                Email tidak dapat diubah
                                            </p>
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label
                                                htmlFor="phone"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Nomor Telepon{' '}
                                                <span className="font-normal text-gray-400">
                                                    (opsional)
                                                </span>
                                            </Label>
                                            <Input
                                                id="phone"
                                                value={phone}
                                                onChange={(e) =>
                                                    setPhone(e.target.value)
                                                }
                                                placeholder="08xxxxxxxxxx"
                                                className="focus-visible:ring-[var(--singgah-green-600)]"
                                            />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label
                                                htmlFor="address"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Alamat{' '}
                                                <span className="font-normal text-gray-400">
                                                    (opsional)
                                                </span>
                                            </Label>
                                            <textarea
                                                id="address"
                                                value={address}
                                                onChange={(e) =>
                                                    setAddress(e.target.value)
                                                }
                                                rows={2}
                                                placeholder="Alamat lengkap Anda"
                                                className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--singgah-green-400)] focus:ring-2 focus:ring-[var(--singgah-green-100)]"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={savingProfile}
                                            className="btn-primary"
                                        >
                                            {savingProfile && (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            )}
                                            Simpan Perubahan
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Tab: Keamanan */}
                            {activeTab === 'keamanan' && (
                                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                    <h2 className="mb-5 font-semibold text-gray-800">
                                        Ubah Kata Sandi
                                    </h2>
                                    <form
                                        onSubmit={savePassword}
                                        className="space-y-4"
                                    >
                                        <div className="grid gap-1.5">
                                            <Label
                                                htmlFor="current_pwd"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Kata Sandi Saat Ini
                                            </Label>
                                            <Input
                                                id="current_pwd"
                                                type="password"
                                                value={currentPwd}
                                                onChange={(e) =>
                                                    setCurrentPwd(
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                className="focus-visible:ring-[var(--singgah-green-600)]"
                                            />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label
                                                htmlFor="new_pwd"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Kata Sandi Baru
                                            </Label>
                                            <Input
                                                id="new_pwd"
                                                type="password"
                                                value={newPwd}
                                                onChange={(e) =>
                                                    setNewPwd(e.target.value)
                                                }
                                                required
                                                minLength={8}
                                                placeholder="Minimal 8 karakter"
                                                className="focus-visible:ring-[var(--singgah-green-600)]"
                                            />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label
                                                htmlFor="confirm_pwd"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Konfirmasi Kata Sandi Baru
                                            </Label>
                                            <Input
                                                id="confirm_pwd"
                                                type="password"
                                                value={confirmPwd}
                                                onChange={(e) =>
                                                    setConfirmPwd(
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                className="focus-visible:ring-[var(--singgah-green-600)]"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={savingPwd}
                                            className="btn-primary"
                                        >
                                            {savingPwd && (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            )}
                                            Ubah Kata Sandi
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Tab: Ulasan */}
                            {activeTab === 'ulasan' && (
                                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                    <h2 className="mb-5 font-semibold text-gray-800">
                                        Ulasan Saya
                                    </h2>
                                    {user.reviews.length === 0 ? (
                                        <div
                                            className="rounded-2xl py-12 text-center"
                                            style={{
                                                background:
                                                    'var(--singgah-green-50)',
                                            }}
                                        >
                                            <Star
                                                className="mx-auto mb-3 h-10 w-10 opacity-30"
                                                style={{
                                                    color: 'var(--singgah-green-600)',
                                                }}
                                            />
                                            <p className="text-sm text-gray-500">
                                                Anda belum pernah menulis
                                                ulasan.
                                            </p>
                                            <Link
                                                href="/explore"
                                                className="btn-primary mt-4 inline-flex"
                                            >
                                                Jelajahi Desa
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {user.reviews.map((r) => (
                                                <div
                                                    key={r.id}
                                                    className="review-item rounded-2xl border border-gray-100 p-4"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-800">
                                                                {r.reviewable
                                                                    ?.name ??
                                                                    'Konten Dihapus'}
                                                            </p>
                                                            <p className="mt-0.5 text-xs text-gray-500">
                                                                {r.reviewable_type.replace(
                                                                    'App\\Models\\',
                                                                    '',
                                                                )}{' '}
                                                                ·{' '}
                                                                {fmtDate(
                                                                    r.created_at,
                                                                )}
                                                            </p>
                                                            <div className="mt-1.5">
                                                                <StarRating
                                                                    value={
                                                                        r.rating
                                                                    }
                                                                    size="sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                deleteReview(
                                                                    r.id,
                                                                )
                                                            }
                                                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-100 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                                            title="Hapus ulasan"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                    {r.comment && (
                                                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                                            {r.comment}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
