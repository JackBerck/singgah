import { Head, Link } from '@inertiajs/react';
import { Home, RefreshCw } from 'lucide-react';

export default function ServiceUnavailable() {
    return (
        <>
            <Head title="503 - Layanan Tidak Tersedia" />
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md text-center">
                    {/* Error Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-[var(--singgah-orange-50)] p-6">
                            <svg
                                className="h-16 w-16 text-[var(--singgah-orange-600)]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Status Code */}
                    <h1 className="mb-3 text-6xl font-bold text-gray-900">
                        503
                    </h1>

                    {/* Error Message */}
                    <h2 className="mb-2 text-2xl font-semibold text-gray-800">
                        Layanan Sedang Dalam Pemeliharaan
                    </h2>
                    <p className="mb-8 text-gray-600">
                        Aplikasi sedang dalam pemeliharaan untuk meningkatkan
                        kualitas layanan. Kami akan kembali sebentar lagi.
                        Terima kasih atas kesabaran Anda.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Coba Lagi
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
