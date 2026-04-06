import { Link } from '@inertiajs/react';
import React from 'react';
import { User as UserIcon, ShieldCheck, Star, Bookmark } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';

interface ProfileLayoutProps {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        avatar: string | null;
    };
    wishlistsCount?: number;
    reviewsCount?: number;
    activeTab: 'akun' | 'keamanan' | 'ulasan' | 'wishlist';
    children: React.ReactNode;
}

export default function ProfileLayout({
    user,
    wishlistsCount = 0,
    reviewsCount = 0,
    activeTab,
    children,
}: ProfileLayoutProps) {
    const avatarPreview = user.avatar ? `/storage/${user.avatar}` : null;

    const tabs = [
        {
            id: 'akun',
            label: 'Informasi Akun',
            href: '/profil',
            icon: <UserIcon className="h-4 w-4" />,
        },
        {
            id: 'keamanan',
            label: 'Keamanan',
            href: '/profil/keamanan',
            icon: <ShieldCheck className="h-4 w-4" />,
        },
        {
            id: 'ulasan',
            label: `Ulasan Saya (${reviewsCount})`,
            href: '/profil/ulasan',
            icon: <Star className="h-4 w-4" />,
        },
        {
            id: 'wishlist',
            label: `Wishlist (${wishlistsCount})`,
            href: '/profil/wishlist',
            icon: <Bookmark className="h-4 w-4" />,
        },
    ];

    return (
        <PublicLayout>
            {/* Header */}
            <div className="section-padding-x hero-gradient pt-24 pb-10">
                <div className="container max-w-4xl">
                    <div className="flex items-center gap-5">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white/60 shadow-lg bg-white">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className="flex h-full w-full items-center justify-center text-2xl font-bold text-white"
                                        style={{
                                            background: 'var(--singgah-teal-600)',
                                        }}
                                    >
                                        {user.name[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h1
                                className="text-xl font-bold text-white"
                                style={{ fontFamily: 'var(--font-jakarta)' }}
                            >
                                {user.name}
                            </h1>
                            <p
                                className="text-sm"
                                style={{ color: 'rgba(255,255,255,0.75)' }}
                            >
                                {user.email}
                            </p>
                            <span
                                className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                style={{
                                    background: 'rgba(255,255,255,0.15)',
                                    color: 'rgba(255,255,255,0.9)',
                                }}
                            >
                                {user.role === 'admin'
                                    ? '🛡️ Admin'
                                    : user.role === 'manager'
                                      ? '🏡 Pengelola'
                                      : '👤 Pengunjung'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <section className="section-padding-x py-8">
                <div className="container max-w-4xl">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start">
                        {/* Sidebar tabs */}
                        <aside className="w-full shrink-0 md:w-52">
                            <nav className="space-y-1 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
                                {tabs.map((t) => (
                                    <Link
                                        key={t.id}
                                        href={t.href}
                                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                                            activeTab === t.id
                                                ? 'text-white'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                        style={
                                            activeTab === t.id
                                                ? {
                                                      background:
                                                          'var(--singgah-green-600)',
                                                  }
                                                : {}
                                        }
                                    >
                                        {t.icon} {t.label}
                                    </Link>
                                ))}

                                <div className="mt-1 border-t border-gray-100 pt-1">
                                    {user.role === 'manager' && (
                                        <Link
                                            href="/manager"
                                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                                        >
                                            🏡 Dashboard Pengelola
                                        </Link>
                                    )}
                                    {user.role === 'admin' && (
                                        <Link
                                            href="/admin"
                                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                                        >
                                            🛡️ Dashboard Admin
                                        </Link>
                                    )}
                                </div>
                            </nav>
                        </aside>

                        {/* Main content */}
                        <div className="min-w-0 flex-1">
                            {children}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
