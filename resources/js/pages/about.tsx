import { Head, Link } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronRight,
    Heart,
    Lightbulb,
    Mail,
    Map,
    MessageCircle,
    Phone,
    Shield,
    Target,
    Trees,
    Users,
    Youtube,
} from 'lucide-react';
import { useState } from 'react';

import PublicLayout from '@/layouts/PublicLayout';

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const faqs = [
    {
        q: 'Apa itu Singgah?',
        a: 'Singgah adalah platform digital berbasis web yang menghubungkan wisatawan dengan desa wisata di seluruh Indonesia. Platform ini memudahkan wisatawan menemukan informasi lengkap tentang atraksi, kuliner, dan akomodasi desa, sekaligus membantu pengelola desa mempromosikan potensi lokal mereka secara mandiri.',
    },
    {
        q: 'Apakah Singgah gratis untuk digunakan?',
        a: 'Ya! Singgah sepenuhnya gratis untuk pengunjung yang ingin menjelajahi dan menemukan desa wisata. Pengelola desa juga dapat mendaftarkan desa mereka secara gratis dan mengelola konten melalui dashboard yang kami sediakan.',
    },
    {
        q: 'Bagaimana cara mendaftarkan desa wisata saya?',
        a: 'Cukup klik tombol "Daftar" di bagian atas halaman, pilih role sebagai Pengelola Desa, lalu lengkapi profil desa Anda. Tim Singgah akan memverifikasi data dalam 1-3 hari kerja sebelum profil desa Anda tampil di platform.',
    },
    {
        q: 'Informasi apa saja yang bisa ditampilkan di profil desa?',
        a: 'Pengelola desa dapat menampilkan deskripsi lengkap desa, galeri foto/video, peta lokasi interaktif, daftar atraksi wisata, kuliner UMKM, akomodasi, hingga kalender event desa yang akan datang.',
    },
    {
        q: 'Apakah ada fitur untuk merencanakan perjalanan wisata?',
        a: 'Ya, Singgah dilengkapi dengan Asisten AI yang dapat membantu Anda merencanakan perjalanan berdasarkan preferensi pribadi, anggaran, dan jenis wisata yang Anda inginkan.',
    },
    {
        q: 'Bagaimana sistem ulasan di Singgah bekerja?',
        a: 'Pengunjung yang telah mengunjungi desa dapat memberikan rating (1-5 bintang) dan komentar pada profil desa. Semua ulasan dimoderasi oleh tim Singgah untuk memastikan konten yang ditampilkan positif, konstruktif, dan terpercaya.',
    },
    {
        q: 'Data dan informasi desa siapa yang mengelola?',
        a: 'Pengelola desa memiliki kendali penuh atas konten di profil desa mereka melalui dashboard. Prinsip kami adalah "pemberdayaan mandiri" — desa yang paling tahu desanya sendiri, Singgah hanya menyediakan wadah digital yang optimal.',
    },
    {
        q: 'Bagaimana jika ada informasi yang tidak akurat di platform?',
        a: 'Anda dapat melaporkan konten yang tidak akurat melalui email kami di halo@singgah.id. Tim moderasi kami akan menindaklanjuti dalam waktu 24 jam. Pengelola desa juga bertanggung jawab menjaga keakuratan informasi di profil masing-masing.',
    },
];

const values = [
    {
        icon: Heart,
        title: 'Pemberdayaan Lokal',
        desc: 'Kami percaya setiap desa memiliki cerita dan potensi uniknya sendiri. Singgah hadir untuk memberi desa-desa Indonesia panggung digital yang layak dan dikelola secara mandiri oleh komunitas lokal.',
        color: 'var(--singgah-green-600)',
        bg: 'var(--singgah-green-50)',
    },
    {
        icon: Lightbulb,
        title: 'Inovasi Berteknologi',
        desc: 'Dari AI Travel Assistant hingga sistem manajemen konten desa, Singgah memanfaatkan teknologi terdepan untuk mempertemukan wisatawan dengan destinasi yang tepat, secara cerdas dan personal.',
        color: 'var(--singgah-teal-600)',
        bg: 'var(--singgah-teal-50)',
    },
    {
        icon: Shield,
        title: 'Informasi Terpercaya',
        desc: 'Setiap desa melalui proses verifikasi sebelum tampil di platform. Kami memastikan informasi yang disajikan akurat, terkini, dan memberikan gambaran nyata tentang pengalaman yang akan didapatkan.',
        color: 'var(--singgah-earth-600)',
        bg: 'var(--singgah-earth-50)',
    },
];

const steps = [
    {
        num: '01',
        icon: Map,
        title: 'Temukan',
        desc: 'Jelajahi ribuan desa wisata berdasarkan kategori, wilayah, atau rekomendasi AI personal.',
    },
    {
        num: '02',
        icon: Trees,
        title: 'Eksplorasi',
        desc: 'Lihat profil lengkap desa: foto, atraksi, kuliner, akomodasi, dan event yang akan datang.',
    },
    {
        num: '03',
        icon: Target,
        title: 'Rencanakan',
        desc: 'Gunakan Asisten AI untuk membuat rencana perjalanan yang sesuai selera dan anggaran Anda.',
    },
    {
        num: '04',
        icon: Users,
        title: 'Kunjungi',
        desc: 'Datang langsung dan rasakan keindahan desa wisata Indonesia yang autentik dan tak terlupakan.',
    },
];

const contacts = [
    {
        icon: Mail,
        label: 'Email',
        value: 'halo@singgah.id',
        href: 'mailto:halo@singgah.id',
        color: 'var(--singgah-green-600)',
    },
    {
        icon: MessageCircle,
        label: 'Instagram',
        value: '@singgah.id',
        href: 'https://instagram.com/singgah.id',
        color: 'var(--singgah-teal-500)',
    },
    {
        icon: Phone,
        label: 'Telepon',
        value: '+62 812 3456 7890',
        href: 'tel:+6281234567890',
        color: 'var(--singgah-green-600)',
    },
];

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            className={`faq-item ${open ? 'border-[var(--singgah-green-300)]' : ''}`}
        >
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={open}
            >
                <span className="normal-font-size leading-snug font-semibold text-gray-900">
                    {q}
                </span>
                <span
                    className="mt-0.5 shrink-0 transition-transform duration-200"
                    style={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        color: 'var(--singgah-green-600)',
                    }}
                >
                    <ChevronDown className="h-5 w-5" />
                </span>
            </button>
            <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open ? '400px' : '0px' }}
            >
                <p className="normal-font-size px-5 pb-5 leading-relaxed text-gray-600">
                    {a}
                </p>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function About() {
    return (
        <PublicLayout>
            <Head title="Tentang Kami — Singgah" />

            {/* ═══ HERO ══════════════════════════════════════════════════════════ */}
            <section className="hero-gradient relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-[0.05]" aria-hidden>
                    <svg
                        className="h-full w-full"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <pattern
                                id="about-pat"
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
                        <rect
                            width="100%"
                            height="100%"
                            fill="url(#about-pat)"
                        />
                    </svg>
                </div>
                <div className="section-padding-x relative z-10">
                    <div className="container max-w-7xl text-center">
                        <span
                            className="small-font-size mb-5 inline-block rounded-full px-4 py-1.5 font-semibold"
                            style={{
                                background: 'rgba(255,255,255,0.12)',
                                color: 'rgba(255,255,255,0.9)',
                                border: '1px solid rgba(255,255,255,0.2)',
                            }}
                        >
                            🌿 Tentang Singgah
                        </span>
                        <h1
                            className="mb-5 leading-tight font-extrabold text-white"
                            style={{
                                fontFamily: 'var(--font-jakarta)',
                                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            }}
                        >
                            Wadah Digital untuk
                            <br />
                            <span style={{ color: 'var(--singgah-teal-400)' }}>
                                Desa Wisata Indonesia
                            </span>
                        </h1>
                        <p
                            className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed"
                            style={{ color: 'rgba(255,255,255,0.8)' }}
                        >
                            Singgah lahir dari keyakinan bahwa setiap desa di
                            Indonesia menyimpan cerita, budaya, dan keindahan
                            yang layak untuk dikenal dunia. Kami hadir untuk
                            menjadi jembatan antara keajaiban desa dan jiwa-jiwa
                            yang ingin menjelajahinya.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link
                                href="/explore"
                                className="btn-primary px-7 py-3.5 text-base"
                            >
                                Jelajahi Desa{' '}
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/register"
                                className="btn-outline-white px-7 py-3.5 text-base"
                            >
                                Daftarkan Desa
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Bottom wave */}
                <div
                    className="absolute right-0 bottom-0 left-0"
                    style={{ marginBottom: '-1px' }}
                    aria-hidden
                >
                    <svg
                        viewBox="0 0 1440 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0 48L60 42C120 36 240 24 360 18C480 12 600 12 720 18C840 24 960 36 1080 40C1200 44 1320 38 1380 35L1440 32V48H0Z"
                            fill="white"
                        />
                    </svg>
                </div>
            </section>

            {/* ═══ STATS ═════════════════════════════════════════════════════════ */}
            <section className="section-padding-x bg-white py-14">
                <div className="container max-w-7xl">
                    <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
                        {[
                            { val: '1.200+', label: 'Desa Wisata' },
                            { val: '34', label: 'Provinsi' },
                            { val: '50.000+', label: 'Pengunjung' },
                            { val: '6', label: 'Kategori Wisata' },
                        ].map(({ val, label }) => (
                            <div
                                key={label}
                                className="rounded-2xl p-6"
                                style={{
                                    background: 'var(--singgah-green-50)',
                                    border: '1.5px solid var(--singgah-green-100)',
                                }}
                            >
                                <p
                                    className="mb-1 text-3xl font-extrabold md:text-4xl"
                                    style={{
                                        fontFamily: 'var(--font-jakarta)',
                                        color: 'var(--singgah-green-700)',
                                    }}
                                >
                                    {val}
                                </p>
                                <p className="small-font-size font-medium text-gray-600">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ MISI & VISI ══════════════════════════════════════════════════ */}
            <section
                className="section-padding-x py-16 md:py-20"
                style={{ background: 'var(--singgah-earth-50)' }}
            >
                <div className="container max-w-7xl">
                    <div className="section-header mx-auto max-w-2xl text-center">
                        <span className="section-label">✦ Nilai Kami</span>
                        <h2 className="section-title">Mengapa Kami Ada</h2>
                        <p className="section-subtitle">
                            Tiga pilar yang menopang setiap keputusan dan fitur
                            yang kami bangun di Singgah.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        {values.map(
                            ({ icon: Icon, title, desc, color, bg }) => (
                                <div key={title} className="value-card">
                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                                        style={{ background: bg }}
                                    >
                                        <Icon
                                            className="h-6 w-6"
                                            style={{ color }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="subtitle-font-size mb-2 font-bold text-gray-900">
                                            {title}
                                        </h3>
                                        <p className="normal-font-size leading-relaxed text-gray-600">
                                            {desc}
                                        </p>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </section>

            {/* ═══ CARA KERJA ════════════════════════════════════════════════════ */}
            <section className="section-padding-x bg-white py-16 md:py-20">
                <div className="container max-w-7xl">
                    <div className="section-header mx-auto max-w-2xl text-center">
                        <span className="section-label">🗺️ Cara Kerja</span>
                        <h2 className="section-title">Mulai Perjalanan Anda</h2>
                        <p className="section-subtitle">
                            Empat langkah sederhana menuju pengalaman wisata
                            desa yang tak terlupakan.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map(({ num, icon: Icon, title, desc }) => (
                            <div key={num} className="step-card group">
                                <span className="step-number-bg">{num}</span>
                                <div
                                    className="relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors group-hover:bg-[var(--singgah-green-600)]"
                                    style={{
                                        background: 'var(--singgah-green-100)',
                                    }}
                                >
                                    <Icon
                                        className="h-7 w-7 transition-colors group-hover:text-white"
                                        style={{
                                            color: 'var(--singgah-green-600)',
                                        }}
                                    />
                                </div>
                                <h3 className="mb-2 text-base font-bold text-gray-900 md:text-lg">
                                    {title}
                                </h3>
                                <p className="small-font-size leading-relaxed text-gray-500">
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ TENTANG PLATFORM ══════════════════════════════════════════════ */}
            <section
                className="section-padding-x py-16 md:py-20"
                style={{ background: 'var(--singgah-green-50)' }}
            >
                <div className="container max-w-7xl">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                        {/* Text */}
                        <div>
                            <span className="section-label">
                                📖 Latar Belakang
                            </span>
                            <h2 className="section-title mb-5">
                                Cerita di Balik Singgah
                            </h2>
                            <div className="normal-font-size space-y-4 leading-relaxed text-gray-600">
                                <p>
                                    Indonesia memiliki potensi desa wisata dan
                                    ekonomi kreatif yang sangat besar, tersebar
                                    dari Sabang sampai Merauke. Namun, potensi
                                    ini seringkali belum maksimal karena
                                    minimnya paparan digital yang terpusat dan
                                    informatif.
                                </p>
                                <p>
                                    Wisatawan kerap kesulitan menemukan
                                    informasi yang valid dan komprehensif
                                    mengenai destinasi, akomodasi, hingga produk
                                    UMKM lokal. Di sisi lain, pihak pengelola
                                    desa belum memiliki media digital yang aktif
                                    dan terintegrasi.
                                </p>
                                <p>
                                    Singgah hadir sebagai jawaban: platform yang
                                    tidak hanya mempromosikan pariwisata, tetapi
                                    juga{' '}
                                    <strong>
                                        memberdayakan ekonomi masyarakat desa
                                        secara langsung
                                    </strong>{' '}
                                    melalui pengalaman pencarian yang interaktif
                                    dan cerdas.
                                </p>
                            </div>
                        </div>
                        {/* Visual Card */}
                        <div className="relative">
                            <div className="hero-gradient relative overflow-hidden rounded-3xl p-8 text-white md:p-10">
                                <div
                                    className="absolute inset-0 opacity-[0.07]"
                                    aria-hidden
                                >
                                    <svg
                                        className="h-full w-full"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <defs>
                                            <pattern
                                                id="story-pat"
                                                x="0"
                                                y="0"
                                                width="50"
                                                height="50"
                                                patternUnits="userSpaceOnUse"
                                            >
                                                <circle
                                                    cx="25"
                                                    cy="25"
                                                    r="10"
                                                    fill="none"
                                                    stroke="white"
                                                    strokeWidth="1"
                                                />
                                            </pattern>
                                        </defs>
                                        <rect
                                            width="100%"
                                            height="100%"
                                            fill="url(#story-pat)"
                                        />
                                    </svg>
                                </div>
                                <div className="relative z-10">
                                    <blockquote
                                        className="mb-6 text-lg leading-relaxed font-medium italic md:text-xl"
                                        style={{
                                            color: 'rgba(255,255,255,0.92)',
                                        }}
                                    >
                                        "Singgah adalah platform cerdas yang
                                        menjembatani wisatawan dengan pesona
                                        desa wisata di seluruh Indonesia."
                                    </blockquote>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex h-10 w-10 items-center justify-center rounded-full"
                                            style={{
                                                background:
                                                    'rgba(255,255,255,0.15)',
                                            }}
                                        >
                                            <Trees className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="small-font-size font-semibold text-white">
                                                Tim Singgah
                                            </p>
                                            <p
                                                className="small-font-size"
                                                style={{
                                                    color: 'rgba(255,255,255,0.65)',
                                                }}
                                            >
                                                Platform Desa Wisata Indonesia
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decoration */}
                            <div
                                className="absolute -right-4 -bottom-4 -z-10 h-24 w-24 rounded-2xl opacity-30"
                                style={{
                                    background: 'var(--singgah-teal-400)',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FAQ ═══════════════════════════════════════════════════════════ */}
            <section className="section-padding-x bg-white py-16 md:py-20">
                <div className="container max-w-7xl">
                    <div className="section-header mx-auto max-w-2xl text-center">
                        <span className="section-label">❓ FAQ</span>
                        <h2 className="section-title">
                            Pertanyaan yang Sering Diajukan
                        </h2>
                        <p className="section-subtitle">
                            Temukan jawaban untuk pertanyaan umum tentang
                            platform Singgah.
                        </p>
                    </div>
                    <div className="mx-auto max-w-3xl space-y-3">
                        {faqs.map((faq, i) => (
                            <FaqItem key={i} q={faq.q} a={faq.a} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ KONTAK ════════════════════════════════════════════════════════ */}
            <section
                className="section-padding-x py-16 md:py-20"
                style={{ background: 'var(--singgah-earth-50)' }}
            >
                <div className="container max-w-7xl">
                    <div className="section-header mx-auto max-w-xl text-center">
                        <span className="section-label">📬 Kontak Kami</span>
                        <h2 className="section-title">
                            Ada Pertanyaan atau Saran?
                        </h2>
                        <p className="section-subtitle">
                            Kami selalu senang mendengar dari Anda. Hubungi kami
                            melalui saluran berikut.
                        </p>
                    </div>
                    <div className="mx-auto mb-10 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3">
                        {contacts.map(
                            ({ icon: Icon, label, value, href, color }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target={
                                        href.startsWith('http')
                                            ? '_blank'
                                            : undefined
                                    }
                                    rel={
                                        href.startsWith('http')
                                            ? 'noopener noreferrer'
                                            : undefined
                                    }
                                    className="value-card items-center text-center hover:no-underline"
                                >
                                    <div
                                        className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
                                        style={{
                                            background:
                                                'var(--singgah-green-50)',
                                        }}
                                    >
                                        <Icon
                                            className="h-6 w-6"
                                            style={{ color }}
                                        />
                                    </div>
                                    <div>
                                        <p className="small-font-size mb-0.5 font-semibold text-gray-500">
                                            {label}
                                        </p>
                                        <p className="normal-font-size font-semibold text-gray-900">
                                            {value}
                                        </p>
                                    </div>
                                </a>
                            ),
                        )}
                    </div>
                    <div className="text-center">
                        <Link
                            href="/register"
                            className="btn-primary inline-flex px-8 py-3.5 text-base"
                        >
                            Daftarkan Desa Anda — Gratis
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
