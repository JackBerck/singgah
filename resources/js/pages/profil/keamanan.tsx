import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProfileLayout from '@/layouts/ProfileLayout';

interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
}

interface Props {
    user: AuthUser;
    wishlists_count: number;
    reviews_count: number;
}

export default function Keamanan({ user, wishlists_count, reviews_count }: Props) {
    const [currentPwd, setCurrentPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [savingPwd, setSavingPwd] = useState(false);

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
                preserveScroll: true,
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

    return (
        <ProfileLayout
            user={user}
            activeTab="keamanan"
            wishlistsCount={wishlists_count}
            reviewsCount={reviews_count}
        >
            <Head title="Keamanan — Singgah" />

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
                                setCurrentPwd(e.target.value)
                            }
                            required
                            className="focus-visible:ring-(--singgah-green-600)"
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
                            onChange={(e) => setNewPwd(e.target.value)}
                            required
                            minLength={8}
                            placeholder="Minimal 8 karakter"
                            className="focus-visible:ring-(--singgah-green-600)]"
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
                                setConfirmPwd(e.target.value)
                            }
                            required
                            className="focus-visible:ring-(--singgah-green-600)]"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={savingPwd}
                        className="btn-primary"
                    >
                        {savingPwd && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        Ubah Kata Sandi
                    </button>
                </form>
            </div>
        </ProfileLayout>
    );
}
