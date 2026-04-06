import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProfileLayout from '@/layouts/ProfileLayout';

interface AuthUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    avatar: string | null;
    role: string;
}

interface Props {
    user: AuthUser;
    wishlists_count: number;
    reviews_count: number;
}

export default function Profil({ user, wishlists_count, reviews_count }: Props) {
    const [name, setName] = useState(user.name);
    const [phone, setPhone] = useState(user.phone ?? '');
    const [address, setAddress] = useState(user.address ?? '');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        user.avatar ? `/storage/${user.avatar}` : null,
    );
    const [savingProfile, setSavingProfile] = useState(false);

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

        // Note: Form sends POST to /profil
        router.post('/profil', fd, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Profil berhasil diperbarui.'),
            onError: (errs) => {
                const msg = Object.values(errs)[0] as string;
                toast.error(msg || 'Gagal memperbarui profil.');
            },
            onFinish: () => setSavingProfile(false),
        });
    };

    return (
        <ProfileLayout
            user={user}
            activeTab="akun"
            wishlistsCount={wishlists_count}
            reviewsCount={reviews_count}
        >
            <Head title="Informasi Akun — Singgah" />

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
                            <div className="h-16 w-16 overflow-hidden rounded-full border border-gray-200 bg-white">
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
                                    onChange={handleAvatarChange}
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
                            className="focus-visible:ring-(--singgah-green-600)"
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
                            className="focus-visible:ring-(--singgah-green-600)"
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
                            rows={3}
                            placeholder="Alamat lengkap Anda"
                            className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-(--singgah-green-400) focus:ring-2 focus:ring-(--singgah-green-100)"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={savingProfile}
                        className="btn-primary"
                    >
                        {savingProfile && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        Simpan Perubahan
                    </button>
                </form>
            </div>
        </ProfileLayout>
    );
}
