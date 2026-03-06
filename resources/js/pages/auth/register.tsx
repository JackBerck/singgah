import { useState } from 'react';
import { Form, Head, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { User, Building2 } from 'lucide-react';

export default function Register() {
    const [selectedRole, setSelectedRole] = useState<'visitor' | 'manager'>(
        'visitor',
    );

    const handleRoleChange = (role: 'visitor' | 'manager') => {
        if (role === 'manager') {
            router.visit('/register/pengelola');
        } else {
            setSelectedRole(role);
        }
    };

    return (
        <AuthLayout
            title="Buat Akun Baru"
            description="Daftarkan diri Anda untuk mulai menjelajahi desa wisata Indonesia"
        >
            <Head title="Daftar" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            {/* Role Chooser */}
                            <div className="grid gap-3">
                                <Label className="text-sm font-medium text-gray-700">
                                    Daftar Sebagai
                                </Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRoleChange('visitor')
                                        }
                                        className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                                            selectedRole === 'visitor'
                                                ? 'border-[var(--singgah-green-600)] bg-[var(--singgah-green-50)]'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                    >
                                        <User
                                            className="h-6 w-6"
                                            style={{
                                                color:
                                                    selectedRole === 'visitor'
                                                        ? 'var(--singgah-green-600)'
                                                        : '#6b7280',
                                            }}
                                        />
                                        <div className="text-center">
                                            <div className="text-sm font-semibold text-gray-900">
                                                Pengunjung
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Jelajahi & ulas desa
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRoleChange('manager')
                                        }
                                        className="flex flex-col items-center gap-2 rounded-lg border-2 border-gray-200 bg-white p-4 transition-all hover:border-gray-300"
                                    >
                                        <Building2 className="h-6 w-6 text-gray-600" />
                                        <div className="text-center">
                                            <div className="text-sm font-semibold text-gray-900">
                                                Pengelola Desa
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Kelola konten desa
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Nama */}
                            <div className="grid gap-1.5">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Nama Lengkap
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nama lengkap Anda"
                                    className="focus-visible:ring-[var(--singgah-green-600)]"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Email */}
                            <div className="grid gap-1.5">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Alamat Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="contoh@email.com"
                                    className="focus-visible:ring-[var(--singgah-green-600)]"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="grid gap-1.5">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Kata Sandi
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Minimal 8 karakter"
                                    className="focus-visible:ring-[var(--singgah-green-600)]"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Konfirmasi password */}
                            <div className="grid gap-1.5">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Konfirmasi Kata Sandi
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Ulangi kata sandi Anda"
                                    className="focus-visible:ring-[var(--singgah-green-600)]"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="mt-1 w-full rounded-full font-semibold text-white"
                                style={{
                                    background: 'var(--singgah-green-600)',
                                }}
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Daftar Sekarang
                            </Button>
                        </div>

                        <div className="text-center text-sm text-gray-500">
                            Sudah punya akun?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="font-semibold transition-colors"
                                style={{ color: 'var(--singgah-green-600)' }}
                            >
                                Masuk
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
