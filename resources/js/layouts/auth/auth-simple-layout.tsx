import { Link } from '@inertiajs/react';
import { Leaf, MapPin, Trees, Users } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

// ─── Batik SVG pattern (same as homepage hero) ───────────────────────────────
function BatikPattern({ id }: { id: string }) {
    return (
        <div className="absolute inset-0 opacity-[0.07]" aria-hidden>
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern
                        id={id}
                        x="0"
                        y="0"
                        width="80"
                        height="80"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle
                            cx="40"
                            cy="40"
                            r="18"
                            fill="none"
                            stroke="white"
                            strokeWidth="1.5"
                        />
                        <circle
                            cx="40"
                            cy="40"
                            r="8"
                            fill="none"
                            stroke="white"
                            strokeWidth="1"
                        />
                        <circle
                            cx="0"
                            cy="0"
                            r="8"
                            fill="none"
                            stroke="white"
                            strokeWidth="1"
                        />
                        <circle
                            cx="80"
                            cy="0"
                            r="8"
                            fill="none"
                            stroke="white"
                            strokeWidth="1"
                        />
                        <circle
                            cx="0"
                            cy="80"
                            r="8"
                            fill="none"
                            stroke="white"
                            strokeWidth="1"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="8"
                            fill="none"
                            stroke="white"
                            strokeWidth="1"
                        />
                        <line
                            x1="22"
                            y1="40"
                            x2="58"
                            y2="40"
                            stroke="white"
                            strokeWidth="0.75"
                        />
                        <line
                            x1="40"
                            y1="22"
                            x2="40"
                            y2="58"
                            stroke="white"
                            strokeWidth="0.75"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${id})`} />
            </svg>
        </div>
    );
}

// ─── Left branding panel ──────────────────────────────────────────────────────
function BrandPanel() {
    const highlights = [
        { icon: Trees, value: '500+', label: 'Desa Wisata' },
        { icon: MapPin, value: '30+', label: 'Provinsi' },
        { icon: Users, value: '10k+', label: 'Pengunjung' },
    ];

    return (
        <div className="auth-panel-left">
            {/* Batik pattern */}
            <BatikPattern id="auth-batik" />

            {/* Glow blobs */}
            <div
                className="absolute -top-16 -right-16 h-72 w-72 rounded-full opacity-20 blur-3xl"
                style={{ background: 'var(--singgah-teal-400)' }}
                aria-hidden
            />
            <div
                className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full opacity-15 blur-3xl"
                style={{ background: 'var(--singgah-earth-400)' }}
                aria-hidden
            />

            {/* Floating leaf accents */}
            <Leaf
                className="absolute top-16 right-10 h-8 w-8 rotate-12 text-white opacity-20"
                aria-hidden
            />
            <Trees
                className="absolute bottom-20 left-10 h-10 w-10 -rotate-6 text-white opacity-15"
                aria-hidden
            />

            {/* Content */}
            <div className="relative z-10 px-12 text-center">
                {/* Logo */}
                <div className="mb-6 flex flex-col items-center gap-3">
                    <div
                        className="flex h-16 w-16 items-center justify-center rounded-2xl"
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        <AppLogoIcon className="h-12 aspect-square fill-current text-white" />
                    </div>
                    <span
                        className="text-3xl font-extrabold tracking-tight text-white"
                        style={{ fontFamily: 'var(--font-jakarta)' }}
                    >
                        Singgah
                    </span>
                </div>

                {/* Tagline */}
                <p
                    className="mb-3 text-lg font-semibold"
                    style={{ color: 'var(--singgah-teal-400)' }}
                >
                    Jelajahi Keindahan Desa
                </p>
                <p
                    className="mx-auto mb-10 max-w-xs text-sm leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.68)' }}
                >
                    Platform desa wisata terlengkap untuk menemukan keindahan
                    budaya, alam, dan kuliner lokal Indonesia.
                </p>

                {/* Stats strip */}
                <div
                    className="mx-auto flex max-w-xs justify-center gap-8 rounded-2xl px-6 py-4"
                    style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                    }}
                >
                    {highlights.map(({ icon: Icon, value, label }) => (
                        <div
                            key={label}
                            className="flex flex-col items-center gap-1"
                        >
                            <Icon
                                className="mb-0.5 h-4 w-4"
                                style={{ color: 'var(--singgah-teal-400)' }}
                            />
                            <span
                                className="text-lg font-extrabold text-white"
                                style={{ fontFamily: 'var(--font-jakarta)' }}
                            >
                                {value}
                            </span>
                            <span
                                className="text-xs"
                                style={{ color: 'rgba(255,255,255,0.6)' }}
                            >
                                {label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Quote */}
                <div
                    className="mx-auto mt-8 max-w-xs rounded-xl px-5 py-3 text-sm italic"
                    style={{
                        background: 'rgba(255,255,255,0.07)',
                        color: 'rgba(255,255,255,0.55)',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    "Setiap desa menyimpan cerita yang menunggu untuk
                    dijelajahi."
                </div>
            </div>
        </div>
    );
}

// ─── Main layout ─────────────────────────────────────────────────────────────
export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="auth-layout-root">
            {/* Left: Brand panel (desktop only) */}
            <BrandPanel />

            {/* Right: Form panel */}
            <div className="auth-panel-right">
                {/* Mobile-only top header strip */}
                <div
                    className="flex items-center gap-3 border-b px-6 py-4 md:hidden"
                    style={{
                        background: 'var(--singgah-green-900)',
                        borderColor: 'rgba(255,255,255,0.08)',
                    }}
                >
                    <div
                        className="flex w-10 aspect-square items-center justify-center rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.12)' }}
                    >
                        <AppLogoIcon className="w-6 aspect-square fill-current text-white" />
                    </div>
                    <div>
                        <span
                            className="block text-sm font-bold text-white"
                            style={{ fontFamily: 'var(--font-jakarta)' }}
                        >
                            Singgah
                        </span>
                        <span
                            className="text-xs"
                            style={{ color: 'rgba(255,255,255,0.55)' }}
                        >
                            Jelajahi Keindahan Desa
                        </span>
                    </div>
                </div>

                {/* Form content area */}
                <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10">
                    <div className="w-full max-w-md">
                        {/* Desktop logo (top of form) */}
                        <Link
                            href={home()}
                            className="mb-8 hidden items-center gap-2.5 md:flex"
                        >
                            <div
                                className="flex w-10 lg:w-12 aspect-square items-center justify-center rounded-lg"
                                style={{
                                    background: 'var(--singgah-green-100)',
                                }}
                            >
                                <AppLogoIcon
                                    className="w-6 lg:w-8 aspect-square fill-current"
                                    style={{
                                        color: 'var(--singgah-green-700)',
                                    }}
                                />
                            </div>
                            <span
                                className="text-lg lg:text-xl font-bold"
                                style={{
                                    color: 'var(--singgah-green-800)',
                                    fontFamily: 'var(--font-jakarta)',
                                }}
                            >
                                Singgah
                            </span>
                        </Link>

                        {/* Title & description */}
                        <div className="mb-7">
                            <h1
                                className="text-2xl leading-tight font-bold"
                                style={{
                                    color: '#1a2e1e',
                                    fontFamily: 'var(--font-jakarta)',
                                }}
                            >
                                {title}
                            </h1>
                            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                                {description}
                            </p>
                        </div>

                        {/* Form slot */}
                        {children}

                        {/* Back to home link */}
                        <div
                            className="mt-8 border-t pt-6"
                            style={{ borderColor: '#e8f5ee' }}
                        >
                            <Link
                                href={home()}
                                className="text-sm transition-colors hover:underline"
                                style={{ color: 'var(--singgah-green-600)' }}
                            >
                                ← Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
