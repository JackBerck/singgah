import { Head, Link } from '@inertiajs/react';
import { Home, AlertTriangle } from 'lucide-react';

export default function ServerError() {
    return (
        <>
            <Head title="500 - Terjadi Kesalahan Server" />
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md text-center">
                    {/* Error Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-[var(--singgah-red-50)] p-6">
                            <AlertTriangle className="h-16 w-16 text-[var(--singgah-red-600)]" />
                        </div>
                    </div>

                    {/* Status Code */}
                    <h1 className="mb-3 text-6xl font-bold text-gray-900">
                        500
                    </h1>

                    {/* Error Message */}
                    <h2 className="mb-2 text-2xl font-semibold text-gray-800">
                        Terjadi Kesalahan Server
                    </h2>
                    <p className="mb-8 text-gray-600">
                        Maaf, terjadi kesalahan pada server kami. Tim kami telah
                        diberitahu dan sedang memperbaiki masalah ini. Silakan
                        coba lagi nanti.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Muat Ulang
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
