import { Head, Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import AuthLayout from '@/layouts/auth-layout';

export default function RegisterManagerSuccess() {
    return (
        <AuthLayout
            title="Pendaftaran Diterima!"
            description="Terima kasih telah mendaftarkan desa Anda di Singgah"
        >
            <Head title="Pendaftaran Berhasil — Singgah" />

            <div className="flex flex-col items-center gap-6 text-center">
                {/* Icon */}
                <div
                    className="flex h-20 w-20 items-center justify-center rounded-full"
                    style={{ background: 'var(--singgah-green-100)' }}
                >
                    <CheckCircle
                        className="h-10 w-10"
                        style={{ color: 'var(--singgah-green-600)' }}
                    />
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <p className="leading-relaxed text-gray-600">
                        Pendaftaran Anda telah berhasil dikirimkan. Tim admin
                        Singgah akan meninjau profil desa Anda dan memberikan
                        konfirmasi dalam waktu <strong>1–3 hari kerja</strong>.
                    </p>
                    <p className="text-sm text-gray-500">
                        Anda akan menerima notifikasi melalui email setelah akun
                        diverifikasi.
                    </p>
                </div>

                {/* Steps */}
                <div className="w-full space-y-2">
                    {[
                        {
                            step: 1,
                            label: 'Pendaftaran dikirimkan',
                            done: true,
                        },
                        {
                            step: 2,
                            label: 'Tinjauan oleh admin Singgah',
                            done: false,
                        },
                        {
                            step: 3,
                            label: 'Akun & desa diaktifkan',
                            done: false,
                        },
                    ].map(({ step, label, done }) => (
                        <div
                            key={step}
                            className="flex items-center gap-3 rounded-xl px-4 py-3"
                            style={{
                                background: done
                                    ? 'var(--singgah-green-50)'
                                    : 'var(--singgah-earth-50)',
                            }}
                        >
                            <div
                                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                style={{
                                    background: done
                                        ? 'var(--singgah-green-600)'
                                        : '#c9b99a',
                                }}
                            >
                                {done ? '✓' : step}
                            </div>
                            <p
                                className={`text-sm font-medium ${done ? 'text-gray-800' : 'text-gray-500'}`}
                            >
                                {label}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex w-full flex-col gap-2">
                    <Link
                        href="/manager"
                        className="btn-primary w-full justify-center rounded-full py-3 text-base"
                    >
                        Ke Dashboard Pengelola
                    </Link>
                    <Link
                        href="/"
                        className="text-sm text-gray-500 hover:underline"
                    >
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
