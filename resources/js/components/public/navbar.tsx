import { Link, usePage } from '@inertiajs/react';
import { Menu, X, Leaf } from 'lucide-react';
import { useEffect, useState } from 'react';

import { dashboard, login, register } from '@/routes';
import AppLogoIcon from '../app-logo-icon';

const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Jelajahi Desa', href: '/explore' },
    { label: 'Tentang Kami', href: '/tentang' },
];

export default function Navbar() {
    const { auth } = usePage().props as {
        auth: { user: { name: string } | null };
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

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    const navBg = scrolled
        ? 'bg-white/95 backdrop-blur-sm shadow-sm'
        : 'bg-transparent';

    const textColor = scrolled ? 'text-gray-800' : 'text-white';
    const logoColor = scrolled
        ? 'text-[var(--singgah-green-700)]'
        : 'text-white';
    const borderColor = scrolled
        ? 'border-[var(--singgah-green-200)]'
        : 'border-white/30';

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
                                        } `}
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

                        {/* Desktop Auth Buttons */}
                        <div className="hidden items-center gap-3 md:flex">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className={`normal-navbar-font-size rounded-full border px-5 py-2 font-semibold transition-all duration-200 ${borderColor} ${textColor} ${scrolled ? 'hover:bg-[var(--singgah-green-50)]' : 'hover:bg-white/10'} `}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className={`normal-navbar-font-size rounded-full px-5 py-2 font-medium transition-all duration-200 ${textColor} ${scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'} `}
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        className={`normal-navbar-font-size rounded-full px-5 py-2 font-semibold transition-all duration-200 ${
                                            scrolled
                                                ? 'bg-[var(--singgah-green-600)] text-white hover:bg-[var(--singgah-green-700)]'
                                                : 'bg-white text-[var(--singgah-green-700)] hover:bg-white/90'
                                        } `}
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
                            className={`rounded-lg p-2 transition-colors md:hidden ${textColor} ${scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'} `}
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

            {/* Mobile Drawer Overlay */}
            {menuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Mobile Drawer */}
            <div
                className={`fixed top-0 right-0 bottom-0 z-50 w-72 transform bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'} `}
            >
                {/* Drawer Header */}
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
                        className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Drawer Nav Links */}
                <div className="flex flex-col gap-1 p-4">
                    {navLinks.map((link) => {
                        const isActive = currentPath === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className={`normal-font-size rounded-xl px-4 py-3 font-medium transition-colors ${
                                    isActive
                                        ? 'bg-[var(--singgah-green-50)] font-semibold text-[var(--singgah-green-700)]'
                                        : 'text-gray-700 hover:bg-gray-50'
                                } `}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Drawer Auth Buttons */}
                <div className="absolute right-0 bottom-0 left-0 border-t border-gray-100 bg-white p-5">
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            onClick={() => setMenuOpen(false)}
                            className="btn-primary w-full justify-center"
                        >
                            Dashboard
                        </Link>
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
                                className="normal-font-size rounded-full py-2.5 text-center font-medium text-gray-600 transition-colors hover:bg-gray-50"
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
