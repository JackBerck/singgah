import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Loader2, User, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import AuthLayout from '@/layouts/auth-layout';

export default function RegisterManager() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        village_name: '',
        village_address: '',
        village_short_description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register/pengelola');
    };

    return (
        <AuthLayout
            title="Daftarkan Desa Anda"
            description="Bergabunglah sebagai Pengelola Desa dan promosikan potensi wisata lokal Anda"
        >
            <Head title="Daftar Pengelola Desa" />
            <form onSubmit={submit} className="flex flex-col gap-5">
                {/* Section: Data Pengelola */}
                <div
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                    style={{ background: 'var(--singgah-green-50)' }}
                >
                    <User
                        className="h-4 w-4"
                        style={{ color: 'var(--singgah-green-600)' }}
                    />
                    <span
                        className="text-sm font-semibold"
                        style={{ color: 'var(--singgah-green-700)' }}
                    >
                        Data Pengelola
                    </span>
                </div>

                <div className="grid gap-4">
                    <div className="grid gap-1.5">
                        <Label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Nama Lengkap
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            autoFocus
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nama lengkap Anda"
                            className="focus-visible:ring-[var(--singgah-green-600)]"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-1.5">
                        <Label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                        >
                            Alamat Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="contoh@email.com"
                            className="focus-visible:ring-[var(--singgah-green-600)]"
                        />
                        <InputError message={errors.email} />
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
                            name="phone"
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="08xxxxxxxxxx"
                            className="focus-visible:ring-[var(--singgah-green-600)]"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <div className="grid gap-1.5">
                        <Label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                        >
                            Kata Sandi
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            placeholder="Minimal 8 karakter"
                            className="focus-visible:ring-[var(--singgah-green-600)]"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-1.5">
                        <Label
                            htmlFor="password_confirmation"
                            className="text-sm font-medium text-gray-700"
                        >
                            Konfirmasi Kata Sandi
                        </Label>
                        <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            required
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            placeholder="Ulangi kata sandi"
                            className="focus-visible:ring-[var(--singgah-green-600)]"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>
                </div>

                {/* Section: Data Desa */}
                <div
                    className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2.5"
                    style={{ background: 'var(--singgah-green-50)' }}
                >
                    <Building2
                        className="h-4 w-4"
                        style={{ color: 'var(--singgah-green-600)' }}
                    />
                    <span
                        className="text-sm font-semibold"
                        style={{ color: 'var(--singgah-green-700)' }}
                    >
                        Data Desa
                    </span>
                </div>

                <div className="grid gap-4">
                    <div className="grid gap-1.5">
                        <Label
                            htmlFor="village_name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Nama Desa
                        </Label>
                        <Input
                            id="village_name"
                            name="village_name"
                            type="text"
                            required
                            value={data.village_name}
                            onChange={(e) =>
                                setData('village_name', e.target.value)
                            }
                            placeholder="Desa Wisata Nusantara"
                            className="focus-visible:ring-[var(--singgah-green-600)]"
                        />
                        <InputError message={errors.village_name} />
                    </div>

                    <div className="grid gap-1.5">
                        <Label
                            htmlFor="village_address"
                            className="text-sm font-medium text-gray-700"
                        >
                            Alamat Desa{' '}
                            <span className="font-normal text-gray-400">
                                (opsional)
                            </span>
                        </Label>
                        <Input
                            id="village_address"
                            name="village_address"
                            type="text"
                            value={data.village_address}
                            onChange={(e) =>
                                setData('village_address', e.target.value)
                            }
                            placeholder="Kec. Contoh, Kab. Contoh, Jawa Barat"
                            className="focus-visible:ring-[var(--singgah-green-600)]"
                        />
                        <InputError message={errors.village_address} />
                    </div>

                    <div className="grid gap-1.5">
                        <Label
                            htmlFor="village_short_description"
                            className="text-sm font-medium text-gray-700"
                        >
                            Deskripsi Singkat{' '}
                            <span className="font-normal text-gray-400">
                                (opsional)
                            </span>
                        </Label>
                        <textarea
                            id="village_short_description"
                            value={data.village_short_description}
                            onChange={(e) =>
                                setData(
                                    'village_short_description',
                                    e.target.value,
                                )
                            }
                            placeholder="Ceritakan keunikan desa Anda secara singkat..."
                            rows={3}
                            maxLength={500}
                            className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--singgah-green-400)] focus:ring-2 focus:ring-[var(--singgah-green-100)]"
                        />
                        <InputError
                            message={errors.village_short_description}
                        />
                    </div>
                </div>

                {/* Notice */}
                <div
                    className="rounded-xl border px-4 py-3 text-sm"
                    style={{
                        background: 'var(--singgah-earth-50)',
                        borderColor: 'var(--singgah-earth-200)',
                    }}
                >
                    <p
                        className="font-semibold"
                        style={{ color: 'var(--singgah-earth-600)' }}
                    >
                        ⏳ Proses Verifikasi
                    </p>
                    <p className="mt-1 text-gray-600">
                        Akun dan desa Anda akan ditinjau oleh tim admin Singgah
                        sebelum aktif. Proses ini biasanya memakan waktu 1–3
                        hari kerja.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="btn-primary mt-1 w-full justify-center rounded-full py-3 text-base"
                >
                    {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                    Daftarkan Desa Saya
                </button>

                <p className="text-center text-sm text-gray-500">
                    Sudah punya akun?{' '}
                    <Link
                        href="/login"
                        className="font-semibold"
                        style={{ color: 'var(--singgah-green-600)' }}
                    >
                        Masuk
                    </Link>
                    {' · '}
                    <Link
                        href="/register"
                        className="font-semibold"
                        style={{ color: 'var(--singgah-green-600)' }}
                    >
                        Daftar sebagai pengunjung
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
