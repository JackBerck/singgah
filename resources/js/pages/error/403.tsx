import { Head, Link } from '@inertiajs/react';
import { Home, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function Forbidden() {
    return (
        <>
            <Head title="403 - Akses Ditolak" />
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md text-center">
                    {/* Error Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-[var(--singgah-orange-50)] p-6">
                            <ShieldAlert className="h-16 w-16 text-[var(--singgah-orange-600)]" />
                        </div>
                    </div>

                    {/* Status Code */}
                    <h1 className="mb-3 text-6xl font-bold text-gray-900">
                        403
                    </h1>

                    {/* Error Message */}
                    <h2 className="mb-2 text-2xl font-semibold text-gray-800">
                        Akses Ditolak
                    </h2>
                    <p className="mb-8 text-gray-600">
                        Maaf, Anda tidak memiliki izin untuk mengakses halaman
                        ini. Silakan hubungi administrator jika Anda merasa ini
                        adalah kesalahan.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </button>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--singgah-green-600)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--singgah-green-700)]"
                        >
                            <Home className="h-4 w-4" />
                            Ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
