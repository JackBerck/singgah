import { Head, Link } from '@inertiajs/react';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <>
            <Head title="404 - Halaman Tidak Ditemukan" />
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md text-center">
                    {/* Error Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-[var(--singgah-red-50)] p-6">
                            <svg
                                className="h-16 w-16 text-[var(--singgah-red-600)]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Status Code */}
                    <h1 className="mb-3 text-6xl font-bold text-gray-900">
                        404
                    </h1>

                    {/* Error Message */}
                    <h2 className="mb-2 text-2xl font-semibold text-gray-800">
                        Halaman Tidak Ditemukan
                    </h2>
                    <p className="mb-8 text-gray-600">
                        Maaf, halaman yang Anda cari tidak dapat ditemukan.
                        Mungkin halaman tersebut telah dipindahkan atau dihapus.
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
