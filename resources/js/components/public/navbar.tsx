import { Link, router, usePage } from '@inertiajs/react';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';
import {
    ChevronDown,
    LayoutDashboard,
    LogOut,
    Menu,
    User,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import AppLogoIcon from '../app-logo-icon';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { login, register } from '@/routes';

const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Jelajahi Desa', href: '/explore' },
    { label: 'Tentang Kami', href: '/tentang' },
];

interface AuthUser {
    name: string;
    role: 'user' | 'manager' | 'admin';
    avatar?: string | null;
}

function UserDropdownAvatar({
    user,
    size = 8,
}: {
    user: AuthUser;
    size?: number;
}) {
    const dicebearSvg = useMemo(() => {
        if (user.avatar) return null;
        return createAvatar(initials, {
            seed: user.name,
            backgroundColor: ['1b7a45'],
            textColor: ['ffffff'],
            fontSize: 40,
        }).toDataUri();
    }, [user.name, user.avatar]);

    const src = user.avatar
        ? `/storage/${user.avatar}`
        : (dicebearSvg ?? undefined);

    return (
        <Avatar className={`h-${size} w-${size}`}>
            <AvatarImage src={src} alt={user.name} />
            <AvatarFallback className="text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    );
}

function UserDropdown({
    user,
    scrolled,
}: {
    user: AuthUser;
    scrolled: boolean;
}) {
    const isDashboardUser = user.role === 'manager' || user.role === 'admin';
    const dashboardHref = user.role === 'admin' ? '/admin' : '/manager';

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-1 ${
                        scrolled
                            ? 'border-gray-200 bg-white/80 text-gray-700 hover:bg-gray-50 focus:ring-gray-200'
                            : 'border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus:ring-white/30'
                    }`}
                >
                    <UserDropdownAvatar user={user} size={7} />
                    <span className="hidden max-w-28 truncate text-sm font-semibold sm:block">
                        {user.name}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-56 overflow-hidden rounded-2xl border border-gray-100 p-1.5 shadow-xl"
            >
                {/* User info pill */}
                <DropdownMenuLabel className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                        <UserDropdownAvatar user={user} size={9} />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-gray-900">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-400 capitalize">
                                {user.role === 'manager'
                                    ? 'Pengelola Desa'
                                    : user.role === 'admin'
                                      ? 'Administrator'
                                      : 'Pengguna'}
                            </p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Profil */}
                <DropdownMenuItem asChild>
                    <Link href="/profil" className="cursor-pointer rounded-xl">
                        <User className="h-4 w-4" />
                        Profil Saya
                    </Link>
                </DropdownMenuItem>

                {/* Dashboard — hanya manager & admin */}
                {isDashboardUser && (
                    <DropdownMenuItem asChild>
                        <Link
                            href={dashboardHref}
                            className="cursor-pointer rounded-xl"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {/* Keluar */}
                <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                    className="cursor-pointer rounded-xl"
                >
                    <LogOut className="h-4 w-4" />
                    Keluar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function Navbar() {
    const { auth } = usePage().props as {
        auth: { user: AuthUser | null };
    };
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const currentPath =
        typeof window !== 'undefined' ? window.location.pathname : '/';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    const navBg = scrolled
        ? 'bg-white/95 backdrop-blur-sm shadow-sm'
        : 'bg-singgah-green-600 backdrop-blur-sm';
    const textColor = scrolled ? 'text-gray-800' : 'text-white';
    const logoColor = scrolled
        ? 'text-[var(--singgah-green-700)]'
        : 'text-white';

    return (
        <>
            <header
                className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${navBg}`}
            >
                <div className="section-padding-x container max-w-7xl">
                    <nav className="flex h-16 items-center justify-between md:h-18">
                        {/* Logo */}
                        <Link
                            href="/"
                            className={`flex items-center gap-2 text-xl font-bold tracking-tight ${logoColor} transition-colors duration-300`}
                        >
                            <AppLogoIcon className="w-8" />
                            <span style={{ fontFamily: 'var(--font-jakarta)' }}>
                                Singgah
                            </span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden items-center gap-1 md:flex">
                            {navLinks.map((link) => {
                                const isActive = currentPath === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`normal-navbar-font-size relative rounded-full px-4 py-2 font-medium transition-all duration-200 ${textColor} ${
                                            isActive
                                                ? scrolled
                                                    ? 'bg-[var(--singgah-green-50)] text-[var(--singgah-green-700)]'
                                                    : 'bg-white/15'
                                                : scrolled
                                                  ? 'hover:bg-gray-100'
                                                  : 'hover:bg-white/10'
                                        }`}
                                    >
                                        {link.label}
                                        {isActive && (
                                            <span
                                                className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full"
                                                style={{
                                                    background: scrolled
                                                        ? 'var(--singgah-green-600)'
                                                        : 'white',
                                                }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Desktop Auth */}
                        <div className="hidden items-center gap-3 md:flex">
                            {auth.user ? (
                                <UserDropdown
                                    user={auth.user}
                                    scrolled={scrolled}
                                />
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className={`normal-navbar-font-size rounded-full px-5 py-2 font-medium transition-all duration-200 ${textColor} ${scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        className={`normal-navbar-font-size rounded-full px-5 py-2 font-semibold transition-all duration-200 ${scrolled ? 'bg-[var(--singgah-green-600)] text-white hover:bg-[var(--singgah-green-700)]' : 'bg-white text-[var(--singgah-green-700)] hover:bg-white/90'}`}
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                            className={`rounded-lg p-2 transition-colors md:hidden ${textColor} ${scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
                        >
                            {menuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </nav>
                </div>
            </header>

            {/* Mobile Overlay */}
            {menuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Mobile Drawer */}
            <div
                className={`fixed top-0 right-0 bottom-0 z-50 w-72 transform bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between border-b border-gray-100 px-5 py-4"
                    style={{ background: 'var(--singgah-green-700)' }}
                >
                    <span
                        className="flex items-center gap-2 text-lg font-bold text-white"
                        style={{ fontFamily: 'var(--font-jakarta)' }}
                    >
                        <AppLogoIcon className="w-6" />
                        Singgah
                    </span>
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* User info in drawer (if logged in) */}
                {auth.user && (
                    <div
                        className="flex items-center gap-3 border-b border-gray-100 px-4 py-3.5"
                        style={{ background: 'var(--singgah-green-50)' }}
                    >
                        <UserDropdownAvatar user={auth.user} size={10} />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-gray-900">
                                {auth.user.name}
                            </p>
                            <p className="text-xs text-gray-400 capitalize">
                                {auth.user.role === 'manager'
                                    ? 'Pengelola Desa'
                                    : auth.user.role === 'admin'
                                      ? 'Admin'
                                      : 'Pengguna'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Nav links */}
                <div className="flex flex-col gap-1 p-4">
                    {navLinks.map((link) => {
                        const isActive = currentPath === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className={`normal-font-size rounded-xl px-4 py-3 font-medium transition-colors ${isActive ? 'bg-[var(--singgah-green-50)] font-semibold text-[var(--singgah-green-700)]' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom auth area */}
                <div className="absolute right-0 bottom-0 left-0 border-t border-gray-100 bg-white p-5">
                    {auth.user ? (
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/profil"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <User className="h-4 w-4 text-gray-400" />
                                Profil Saya
                            </Link>
                            {(auth.user.role === 'manager' ||
                                auth.user.role === 'admin') && (
                                <Link
                                    href={
                                        auth.user.role === 'admin'
                                            ? '/admin'
                                            : '/manager'
                                    }
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <LayoutDashboard className="h-4 w-4 text-gray-400" />
                                    Dashboard
                                </Link>
                            )}
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    router.post('/logout');
                                }}
                                className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="h-4 w-4" />
                                Keluar
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2.5">
                            <Link
                                href={register()}
                                onClick={() => setMenuOpen(false)}
                                className="btn-primary justify-center"
                            >
                                Daftar Sekarang
                            </Link>
                            <Link
                                href={login()}
                                onClick={() => setMenuOpen(false)}
                                className="normal-font-size rounded-full py-2.5 text-center font-medium text-gray-600 hover:bg-gray-50"
                            >
                                Sudah punya akun? Masuk
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
