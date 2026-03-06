import { Head, Link } from '@inertiajs/react';
import { Home, LogIn } from 'lucide-react';

export default function Unauthorized() {
    return (
        <>
            <Head title="401 - Tidak Terautentikasi" />
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
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Status Code */}
                    <h1 className="mb-3 text-6xl font-bold text-gray-900">
                        401
                    </h1>

                    {/* Error Message */}
                    <h2 className="mb-2 text-2xl font-semibold text-gray-800">
                        Silakan Login Terlebih Dahulu
                    </h2>
                    <p className="mb-8 text-gray-600">
                        Untuk mengakses halaman ini, Anda perlu login terlebih
                        dahulu. Silakan masuk dengan akun Anda.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            <Home className="h-4 w-4" />
                            Ke Beranda
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--singgah-green-600)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--singgah-green-700)]"
                        >
                            <LogIn className="h-4 w-4" />
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
