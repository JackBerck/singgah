import { Link } from '@inertiajs/react';
import { Leaf, Instagram, Youtube, MapPin, Mail } from 'lucide-react';

const footerColumns = [
    {
        title: 'Navigasi',
        links: [
            { label: 'Beranda', href: '/' },
            { label: 'Jelajahi Desa', href: '/explore' },
            { label: 'Tentang Kami', href: '/tentang' },
            { label: 'Hubungi Kami', href: '/kontak' },
        ],
    },
    {
        title: 'Kategori',
        links: [
            { label: 'Wisata Alam', href: '/explore?kategori=alam' },
            { label: 'Budaya & Tradisi', href: '/explore?kategori=budaya' },
            { label: 'Kuliner Lokal', href: '/explore?kategori=kuliner' },
            { label: 'Agrowisata', href: '/explore?kategori=agrowisata' },
            { label: 'Pesisir & Bahari', href: '/explore?kategori=pesisir' },
        ],
    },
    {
        title: 'Pengelola',
        links: [
            { label: 'Daftarkan Desa', href: '/register' },
            { label: 'Login Pengelola', href: '/login' },
            { label: 'Kebijakan Privasi', href: '/privasi' },
            { label: 'Syarat & Ketentuan', href: '/syarat' },
        ],
    },
];

const socialLinks = [
    {
        label: 'Instagram',
        href: 'https://instagram.com/singgah.id',
        icon: <Instagram className="h-4 w-4" />,
    },
    {
        label: 'YouTube',
        href: 'https://youtube.com/@singgah.id',
        icon: <Youtube className="h-4 w-4" />,
    },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            style={{ background: 'var(--singgah-green-900)' }}
            className="text-white"
        >
            <div className="section-padding-x">
                <div className="container max-w-7xl">
                    {/* Main Grid */}
                    <div className="grid grid-cols-1 gap-10 py-14 lg:grid-cols-2 lg:gap-20">
                        {/* Brand Column */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <Link
                                href="/"
                                className="group mb-4 flex items-center gap-2"
                            >
                                <span
                                    className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors group-hover:opacity-90"
                                    style={{
                                        background: 'var(--singgah-teal-500)',
                                    }}
                                >
                                    <Leaf
                                        className="h-5 w-5 text-white"
                                        strokeWidth={2.5}
                                    />
                                </span>
                                <span
                                    className="text-2xl font-bold text-white"
                                    style={{
                                        fontFamily: 'var(--font-jakarta)',
                                    }}
                                >
                                    Singgah
                                </span>
                            </Link>
                            <p
                                className="normal-footer-font-size leading-relaxed"
                                style={{ color: 'var(--singgah-green-200)' }}
                            >
                                Platform digital yang menghubungkan wisatawan
                                dengan keindahan desa wisata Indonesia. Jelajahi
                                budaya, kuliner, dan alam desa yang autentik.
                            </p>

                            {/* Contact Info */}
                            <div className="mt-6 flex flex-col gap-2.5">
                                <div
                                    className="normal-footer-font-size flex items-start gap-2.5"
                                    style={{
                                        color: 'var(--singgah-green-200)',
                                    }}
                                >
                                    <MapPin
                                        className="mt-0.5 h-4 w-4 shrink-0"
                                        style={{
                                            color: 'var(--singgah-teal-400)',
                                        }}
                                    />
                                    <span>Indonesia 🇮🇩</span>
                                </div>
                                <div
                                    className="normal-footer-font-size flex items-center gap-2.5"
                                    style={{
                                        color: 'var(--singgah-green-200)',
                                    }}
                                >
                                    <Mail
                                        className="h-4 w-4 shrink-0"
                                        style={{
                                            color: 'var(--singgah-teal-400)',
                                        }}
                                    />
                                    <span>halo@singgah.id</span>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="mt-5 flex items-center gap-2">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:-translate-y-0.5"
                                        style={{
                                            background:
                                                'rgba(255,255,255,0.08)',
                                            color: 'var(--singgah-green-200)',
                                        }}
                                        onMouseEnter={(e) => {
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.background =
                                                'var(--singgah-teal-500)';
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.background =
                                                'rgba(255,255,255,0.08)';
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.color =
                                                'var(--singgah-green-200)';
                                        }}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Link Columns */}
                        <div className="flex justify-between gap-10 sm:gap-12 flex-col sm:flex-row">
                            {footerColumns.map((col) => (
                                <div key={col.title}>
                                    <h4
                                        className="title-footer-font-size mb-4 font-semibold"
                                        style={{
                                            color: 'var(--singgah-teal-400)',
                                        }}
                                    >
                                        {col.title}
                                    </h4>
                                    <ul className="flex flex-col gap-2.5">
                                        {col.links.map((link) => (
                                            <li key={link.label}>
                                                <Link
                                                    href={link.href}
                                                    className="normal-footer-font-size inline-block transition-all duration-150 hover:translate-x-0.5"
                                                    style={{
                                                        color: 'var(--singgah-green-200)',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        (
                                                            e.currentTarget as HTMLElement
                                                        ).style.color = 'white';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        (
                                                            e.currentTarget as HTMLElement
                                                        ).style.color =
                                                            'var(--singgah-green-200)';
                                                    }}
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div
                        className="border-t"
                        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                    />

                    {/* Bottom Bar */}
                    <div className="flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
                        <p
                            className="small-font-size text-center sm:text-left"
                            style={{ color: 'var(--singgah-green-400)' }}
                        >
                            © {currentYear} Singgah. Semua hak dilindungi.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
