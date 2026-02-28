import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    BookOpen,
    FileText,
    Gavel,
    Lock,
    Mail,
    RefreshCw,
    Shield,
    Trash2,
    UserCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';

import PublicLayout from '@/layouts/PublicLayout';

// ─── TOC Sections ─────────────────────────────────────────────────────────────

const sections = [
    { id: 'pengantar', label: 'Pengantar & Penerimaan' },
    { id: 'definisi', label: 'Definisi' },
    { id: 'penggunaan', label: 'Penggunaan Platform' },
    { id: 'pengunjung', label: 'Hak & Kewajiban Pengunjung' },
    { id: 'pengelola', label: 'Hak & Kewajiban Pengelola' },
    { id: 'konten', label: 'Konten & Moderasi' },
    { id: 'kekayaan', label: 'Kekayaan Intelektual' },
    { id: 'tanggung-jawab', label: 'Pembatasan Tanggung Jawab' },
    { id: 'penghentian', label: 'Penghentian Akun' },
    { id: 'perubahan', label: 'Perubahan Ketentuan' },
    { id: 'hukum', label: 'Hukum yang Berlaku' },
];

import { useEffect } from 'react';

function useStickyToc(ids: string[]) {
    const [activeId, setActiveId] = useState(ids[0]);
    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveId(id);
                },
                { rootMargin: '-20% 0px -70% 0px' },
            );
            obs.observe(el);
            observers.push(obs);
        });
        return () => observers.forEach((o) => o.disconnect());
    }, [ids]);
    return activeId;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Terms() {
    const sectionIds = sections.map((s) => s.id);
    const activeId = useStickyToc(sectionIds);
    const [tocOpen, setTocOpen] = useState(false);
    const lastUpdated = '28 Februari 2026';

    const scrollTo = (id: string) => {
        document
            .getElementById(id)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTocOpen(false);
    };

    return (
        <PublicLayout>
            <Head title="Syarat & Ketentuan — Singgah" />

            {/* ═══ HERO ════════════════════════════════════════════════════════ */}
            <section className="hero-gradient relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20">
                <div className="absolute inset-0 opacity-[0.05]" aria-hidden>
                    <svg
                        className="h-full w-full"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <pattern
                                id="terms-pat"
                                x="0"
                                y="0"
                                width="50"
                                height="50"
                                patternUnits="userSpaceOnUse"
                            >
                                <polygon
                                    points="25,5 45,40 5,40"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1"
                                />
                            </pattern>
                        </defs>
                        <rect
                            width="100%"
                            height="100%"
                            fill="url(#terms-pat)"
                        />
                    </svg>
                </div>
                <div className="section-padding-x relative z-10 text-center">
                    <div className="container max-w-4xl">
                        <div
                            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                            style={{ background: 'rgba(255,255,255,0.15)' }}
                        >
                            <FileText className="h-8 w-8 text-white" />
                        </div>
                        <h1
                            className="mb-3 leading-tight font-extrabold text-white"
                            style={{
                                fontFamily: 'var(--font-jakarta)',
                                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                            }}
                        >
                            Syarat & Ketentuan
                        </h1>
                        <p
                            className="normal-font-size mb-3"
                            style={{ color: 'rgba(255,255,255,0.75)' }}
                        >
                            Harap baca dengan seksama sebelum menggunakan
                            layanan Singgah.
                        </p>
                        <span
                            className="small-font-size inline-block rounded-full px-3 py-1"
                            style={{
                                background: 'rgba(255,255,255,0.12)',
                                color: 'rgba(255,255,255,0.8)',
                            }}
                        >
                            Terakhir diperbarui: {lastUpdated}
                        </span>
                    </div>
                </div>
                <div
                    className="absolute right-0 bottom-0 left-0"
                    style={{ marginBottom: '-1px' }}
                >
                    <svg
                        viewBox="0 0 1440 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full"
                        preserveAspectRatio="none"
                    >
                        <path d="M0 40L720 12L1440 40V40H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* ═══ MOBILE TOC ══════════════════════════════════════════════════ */}
            <div
                className="section-padding-x sticky top-16 z-30 border-b bg-white py-4 lg:hidden"
                style={{ borderColor: 'var(--singgah-green-100)' }}
            >
                <button
                    onClick={() => setTocOpen(!tocOpen)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold"
                    style={{
                        background: 'var(--singgah-green-50)',
                        color: 'var(--singgah-green-700)',
                    }}
                >
                    <span>📋 Daftar Isi</span>
                    <span
                        style={{
                            transform: tocOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s',
                            display: 'inline-block',
                        }}
                    >
                        ▼
                    </span>
                </button>
                {tocOpen && (
                    <div
                        className="mt-2 overflow-hidden rounded-xl border"
                        style={{ borderColor: 'var(--singgah-green-100)' }}
                    >
                        {sections.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => scrollTo(s.id)}
                                className={`toc-link w-full rounded-none border-b text-left last:border-b-0 ${activeId === s.id ? 'active' : ''}`}
                                style={{
                                    borderColor: 'var(--singgah-green-50)',
                                }}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ═══ CONTENT + SIDEBAR TOC ═══════════════════════════════════════ */}
            <section className="section-padding-x bg-white py-12">
                <div className="container max-w-7xl">
                    <div className="flex items-start gap-10">
                        {/* Sidebar TOC — Desktop */}
                        <aside className="sticky top-24 hidden w-60 shrink-0 self-start lg:block xl:w-64">
                            <div
                                className="rounded-2xl p-4"
                                style={{
                                    background: 'var(--singgah-green-50)',
                                    border: '1.5px solid var(--singgah-green-100)',
                                }}
                            >
                                <p
                                    className="small-font-size mb-3 px-3 font-bold tracking-wider uppercase"
                                    style={{
                                        color: 'var(--singgah-green-600)',
                                    }}
                                >
                                    Daftar Isi
                                </p>
                                <nav className="flex flex-col gap-0.5">
                                    {sections.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => scrollTo(s.id)}
                                            className={`toc-link text-left ${activeId === s.id ? 'active' : ''}`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <article className="max-w-3xl min-w-0 flex-1">
                            {/* 1. Pengantar */}
                            <div id="pengantar" className="legal-section">
                                <h2 className="legal-h2">
                                    Pengantar & Penerimaan Ketentuan
                                </h2>
                                <p className="legal-p">
                                    Syarat dan Ketentuan ini ("Ketentuan")
                                    mengatur penggunaan platform Singgah yang
                                    dioperasikan oleh Tim Singgah. Dengan
                                    membuat akun atau menggunakan layanan kami,
                                    Anda menyatakan bahwa Anda telah membaca,
                                    memahami, dan menyetujui untuk terikat oleh
                                    Ketentuan ini.
                                </p>
                                <p className="legal-p">
                                    Jika Anda tidak menyetujui Ketentuan ini,
                                    Anda tidak diizinkan untuk menggunakan
                                    layanan Singgah. Penggunaan berkelanjutan
                                    atas layanan kami setelah perubahan apapun
                                    pada Ketentuan ini merupakan persetujuan
                                    Anda terhadap perubahan tersebut.
                                </p>
                                <p className="legal-p">
                                    Ketentuan ini berlaku untuk semua pengguna
                                    Singgah, termasuk{' '}
                                    <strong>Pengunjung</strong> (wisatawan yang
                                    menggunakan platform untuk menemukan desa
                                    wisata) dan <strong>Pengelola Desa</strong>{' '}
                                    (pihak yang mendaftarkan dan mengelola
                                    profil desa wisata di platform).
                                </p>
                            </div>

                            {/* 2. Definisi */}
                            <div id="definisi" className="legal-section">
                                <h2 className="legal-h2">Definisi</h2>
                                <ul className="legal-ul">
                                    <li>
                                        <strong>"Platform"</strong> berarti
                                        layanan web Singgah yang dapat diakses
                                        di singgah.id.
                                    </li>
                                    <li>
                                        <strong>"Pengguna"</strong> berarti
                                        setiap individu yang mengakses atau
                                        menggunakan Platform, termasuk
                                        Pengunjung dan Pengelola Desa.
                                    </li>
                                    <li>
                                        <strong>"Pengunjung"</strong> berarti
                                        pengguna yang menggunakan Platform untuk
                                        mencari dan menjelajahi informasi desa
                                        wisata.
                                    </li>
                                    <li>
                                        <strong>"Pengelola Desa"</strong>{' '}
                                        berarti pengguna yang terdaftar dan
                                        diverifikasi untuk mengelola profil satu
                                        atau lebih desa wisata di Platform.
                                    </li>
                                    <li>
                                        <strong>"Konten"</strong> berarti semua
                                        teks, gambar, video, data, dan materi
                                        lainnya yang diunggah atau dibuat di
                                        Platform.
                                    </li>
                                    <li>
                                        <strong>"Layanan"</strong> berarti semua
                                        fitur, fungsi, dan layanan yang
                                        disediakan melalui Platform.
                                    </li>
                                </ul>
                            </div>

                            {/* 3. Penggunaan Platform */}
                            <div id="penggunaan" className="legal-section">
                                <h2 className="legal-h2">
                                    Penggunaan Platform
                                </h2>
                                <h3 className="legal-h3">3.1 Usia Minimum</h3>
                                <p className="legal-p">
                                    Anda harus berusia minimal 17 tahun untuk
                                    membuat akun di Singgah. Dengan mendaftar,
                                    Anda menyatakan bahwa Anda memenuhi
                                    persyaratan usia ini.
                                </p>
                                <h3 className="legal-h3">
                                    3.2 Penggunaan yang Dilarang
                                </h3>
                                <p className="legal-p">
                                    Anda dilarang menggunakan Platform untuk:
                                </p>
                                <ul className="legal-ul">
                                    <li>
                                        Aktivitas ilegal atau yang melanggar
                                        peraturan yang berlaku di Indonesia.
                                    </li>
                                    <li>
                                        Menyebarkan informasi yang menyesatkan,
                                        palsu, atau menipu tentang desa wisata.
                                    </li>
                                    <li>
                                        Melakukan spam, scraping data, atau
                                        mengakses Platform secara otomatis tanpa
                                        izin.
                                    </li>
                                    <li>
                                        Mengganggu operasional Platform atau
                                        server kami.
                                    </li>
                                    <li>
                                        Melanggar hak privasi atau kekayaan
                                        intelektual pihak lain.
                                    </li>
                                </ul>
                                <h3 className="legal-h3">3.3 Keamanan Akun</h3>
                                <p className="legal-p">
                                    Anda bertanggung jawab penuh atas keamanan
                                    kredensial akun Anda dan semua aktivitas
                                    yang terjadi di bawah akun Anda. Segera
                                    hubungi kami jika Anda mencurigai akun Anda
                                    telah dikompromikan.
                                </p>
                            </div>

                            {/* 4. Hak & Kewajiban Pengunjung */}
                            <div id="pengunjung" className="legal-section">
                                <h2 className="legal-h2">
                                    Hak & Kewajiban Pengunjung
                                </h2>
                                <span className="role-badge role-badge-visitor">
                                    👤 Pengunjung / Wisatawan
                                </span>
                                <h3 className="legal-h3">4.1 Hak Pengunjung</h3>
                                <ul className="legal-ul">
                                    <li>
                                        Mengakses dan menelusuri konten Platform
                                        secara gratis.
                                    </li>
                                    <li>
                                        Menggunakan fitur pencarian, filter, dan
                                        AI Travel Assistant.
                                    </li>
                                    <li>
                                        Memberikan ulasan dan rating untuk desa
                                        wisata yang pernah dikunjungi.
                                    </li>
                                    <li>
                                        Menyimpan desa favorit ke dalam daftar
                                        kunjungan pribadi.
                                    </li>
                                    <li>
                                        Mengelola dan menghapus akun serta data
                                        pribadi.
                                    </li>
                                </ul>
                                <h3 className="legal-h3">
                                    4.2 Kewajiban Pengunjung
                                </h3>
                                <ul className="legal-ul">
                                    <li>
                                        Memberikan informasi yang akurat dan
                                        jujur saat mendaftar dan menggunakan
                                        Platform.
                                    </li>
                                    <li>
                                        Hanya memberikan ulasan berdasarkan
                                        pengalaman nyata dan faktual.
                                    </li>
                                    <li>
                                        Tidak menggunakan Platform untuk
                                        mengunggah konten yang mengandung SARA,
                                        pornografi, atau kekerasan.
                                    </li>
                                    <li>
                                        Menghormati hak privasi pengelola desa
                                        dan komunitas lokal.
                                    </li>
                                    <li>
                                        Tidak menyalahgunakan fitur pelaporan
                                        atau ulasan untuk merugikan pihak
                                        tertentu.
                                    </li>
                                </ul>
                                <h3 className="legal-h3">
                                    4.3 Ulasan & Rating
                                </h3>
                                <p className="legal-p">
                                    Ulasan yang Anda berikan bersifat publik dan
                                    dapat dilihat oleh semua pengguna Platform.
                                    Ulasan harus mencerminkan pengalaman nyata
                                    Anda, bersifat konstruktif, dan tidak
                                    mengandung konten yang menyinggung. Singgah
                                    berhak menghapus ulasan yang melanggar
                                    pedoman komunitas kami.
                                </p>
                            </div>

                            {/* 5. Hak & Kewajiban Pengelola Desa */}
                            <div id="pengelola" className="legal-section">
                                <h2 className="legal-h2">
                                    Hak & Kewajiban Pengelola Desa
                                </h2>
                                <span className="role-badge role-badge-manager">
                                    🌿 Pengelola Desa
                                </span>
                                <h3 className="legal-h3">
                                    5.1 Proses Verifikasi
                                </h3>
                                <p className="legal-p">
                                    Pendaftaran sebagai Pengelola Desa
                                    memerlukan proses verifikasi oleh tim
                                    Singgah. Kami berhak menolak atau mencabut
                                    status Pengelola Desa jika terdapat
                                    informasi yang tidak valid atau melanggar
                                    Ketentuan ini.
                                </p>
                                <h3 className="legal-h3">
                                    5.2 Hak Pengelola Desa
                                </h3>
                                <ul className="legal-ul">
                                    <li>
                                        Mengelola profil desa secara mandiri
                                        melalui dashboard yang disediakan.
                                    </li>
                                    <li>
                                        Mengunggah foto, video, dan informasi
                                        wisata desa.
                                    </li>
                                    <li>
                                        Memperbarui informasi atraksi, kuliner,
                                        akomodasi, dan event desa.
                                    </li>
                                    <li>
                                        Melihat statistik kunjungan profil desa
                                        secara agregat.
                                    </li>
                                    <li>
                                        Merespons ulasan yang diberikan
                                        pengunjung melalui fitur balasan.
                                    </li>
                                </ul>
                                <h3 className="legal-h3">
                                    5.3 Kewajiban Pengelola Desa
                                </h3>
                                <ul className="legal-ul">
                                    <li>
                                        Memastikan semua informasi yang diunggah
                                        akurat, terkini, dan tidak menyesatkan.
                                    </li>
                                    <li>
                                        Tidak mengunggah konten yang merupakan
                                        hak kekayaan intelektual pihak lain
                                        tanpa izin.
                                    </li>
                                    <li>
                                        Tidak melakukan praktik pemasaran yang
                                        menipu atau memberikan janji palsu
                                        kepada wisatawan.
                                    </li>
                                    <li>
                                        Menjaga standar kualitas layanan desa
                                        agar sesuai dengan informasi yang
                                        dipublikasikan.
                                    </li>
                                    <li>
                                        Segera memperbarui informasi jika
                                        terjadi perubahan pada layanan atau
                                        kondisi desa.
                                    </li>
                                    <li>
                                        Mengelola konten dengan bertanggung
                                        jawab dan sesuai pedoman komunitas
                                        Singgah.
                                    </li>
                                </ul>
                                <h3 className="legal-h3">
                                    5.4 Tanggung Jawab Konten
                                </h3>
                                <p className="legal-p">
                                    Pengelola Desa bertanggung jawab penuh atas
                                    keakuratan dan legalitas semua konten yang
                                    diunggah. Singgah tidak bertanggung jawab
                                    atas kerugian yang timbul akibat informasi
                                    yang tidak akurat yang diunggah oleh
                                    Pengelola Desa.
                                </p>
                            </div>

                            {/* 6. Konten & Moderasi */}
                            <div id="konten" className="legal-section">
                                <h2 className="legal-h2">Konten & Moderasi</h2>
                                <p className="legal-p">
                                    Semua konten yang diunggah ke Platform
                                    tunduk pada moderasi oleh tim Singgah. Kami
                                    berhak, tanpa pemberitahuan, untuk
                                    menghapus, menyembunyikan, atau memodifikasi
                                    konten yang:
                                </p>
                                <ul className="legal-ul">
                                    <li>
                                        Melanggar hukum Indonesia atau hukum
                                        internasional yang berlaku.
                                    </li>
                                    <li>
                                        Mengandung SARA, ujaran kebencian, atau
                                        konten diskriminatif.
                                    </li>
                                    <li>
                                        Bersifat pornografi, kekerasan, atau
                                        tidak sesuai untuk konsumsi umum.
                                    </li>
                                    <li>
                                        Merupakan spam, iklan tidak sah, atau
                                        konten promosi yang menyesatkan.
                                    </li>
                                    <li>
                                        Melanggar hak kekayaan intelektual pihak
                                        lain.
                                    </li>
                                </ul>
                                <p className="legal-p">
                                    Pengguna dapat melaporkan konten yang
                                    mencurigakan melalui fitur pelaporan dalam
                                    Platform atau melalui email kami.
                                </p>
                            </div>

                            {/* 7. Kekayaan Intelektual */}
                            <div id="kekayaan" className="legal-section">
                                <h2 className="legal-h2">
                                    Kekayaan Intelektual
                                </h2>
                                <h3 className="legal-h3">
                                    7.1 Konten Platform
                                </h3>
                                <p className="legal-p">
                                    Merek dagang Singgah, logo, desain, kode
                                    perangkat lunak, dan konten yang dibuat oleh
                                    tim Singgah adalah milik kami dan dilindungi
                                    oleh hukum kekayaan intelektual yang
                                    berlaku. Anda tidak diizinkan mereproduksi,
                                    mendistribusikan, atau membuat karya turunan
                                    tanpa izin tertulis dari kami.
                                </p>
                                <h3 className="legal-h3">
                                    7.2 Konten yang Diunggah Pengguna
                                </h3>
                                <p className="legal-p">
                                    Anda tetap memiliki hak kekayaan intelektual
                                    atas konten yang Anda unggah. Namun, dengan
                                    mengunggah konten ke Platform, Anda
                                    memberikan kepada Singgah lisensi
                                    non-eksklusif, bebas royalti, dan dapat
                                    disublisensikan untuk menggunakan,
                                    mereproduksi, dan menampilkan konten
                                    tersebut semata-mata dalam rangka
                                    operasional Platform.
                                </p>
                            </div>

                            {/* 8. Pembatasan Tanggung Jawab */}
                            <div id="tanggung-jawab" className="legal-section">
                                <h2 className="legal-h2">
                                    Pembatasan Tanggung Jawab
                                </h2>
                                <p className="legal-p">
                                    Singgah menyediakan Platform "sebagaimana
                                    adanya" tanpa jaminan apapun. Sejauh
                                    diizinkan oleh hukum yang berlaku, Singgah
                                    tidak bertanggung jawab atas:
                                </p>
                                <ul className="legal-ul">
                                    <li>
                                        Kerugian tidak langsung, insidental,
                                        atau konsekuensial akibat penggunaan
                                        Platform.
                                    </li>
                                    <li>
                                        Keakuratan informasi yang diunggah oleh
                                        Pengelola Desa atau pengguna lain.
                                    </li>
                                    <li>
                                        Pengalaman wisata aktual yang mungkin
                                        berbeda dari informasi di Platform.
                                    </li>
                                    <li>
                                        Gangguan layanan, kehilangan data, atau
                                        kegagalan teknis yang berada di luar
                                        kendali kami.
                                    </li>
                                </ul>
                                <p className="legal-p">
                                    Singgah berperan sebagai perantara informasi
                                    dan tidak bertindak sebagai agen perjalanan
                                    atau penyedia jasa wisata secara langsung.
                                </p>
                            </div>

                            {/* 9. Penghentian Akun */}
                            <div id="penghentian" className="legal-section">
                                <h2 className="legal-h2">
                                    Penghentian & Penonaktifan Akun
                                </h2>
                                <h3 className="legal-h3">9.1 Oleh Pengguna</h3>
                                <p className="legal-p">
                                    Anda dapat menghapus akun Anda kapan saja
                                    melalui halaman Pengaturan Akun. Penghapusan
                                    akun akan menyebabkan penghapusan data
                                    pribadi Anda sesuai dengan Kebijakan Privasi
                                    kami.
                                </p>
                                <h3 className="legal-h3">9.2 Oleh Singgah</h3>
                                <p className="legal-p">
                                    Singgah berhak untuk menangguhkan atau
                                    menghentikan akun Anda, dengan atau tanpa
                                    pemberitahuan, jika Anda melanggar Ketentuan
                                    ini, terlibat dalam aktivitas penipuan, atau
                                    jika diperlukan berdasarkan kewajiban hukum.
                                </p>
                                <h3 className="legal-h3">
                                    9.3 Efek Penghentian
                                </h3>
                                <p className="legal-p">
                                    Setelah akun dihentikan, hak Anda untuk
                                    menggunakan Platform akan berakhir. Konten
                                    yang Anda unggah mungkin tetap tersedia
                                    dalam Platform sesuai kebijakan moderasi
                                    kami, kecuali Anda secara spesifik meminta
                                    penghapusan.
                                </p>
                            </div>

                            {/* 10. Perubahan */}
                            <div id="perubahan" className="legal-section">
                                <h2 className="legal-h2">
                                    Perubahan Ketentuan
                                </h2>
                                <p className="legal-p">
                                    Kami berhak mengubah Ketentuan ini kapan
                                    saja. Perubahan material akan
                                    dikomunikasikan melalui notifikasi email
                                    atau pemberitahuan di dalam Platform
                                    setidaknya 7 hari kalender sebelum perubahan
                                    berlaku.
                                </p>
                                <p className="legal-p">
                                    Penggunaan Platform yang berkelanjutan
                                    setelah tanggal efektif perubahan dianggap
                                    sebagai penerimaan Anda atas Ketentuan yang
                                    diperbarui.
                                </p>
                            </div>

                            {/* 11. Hukum */}
                            <div id="hukum" className="legal-section">
                                <h2 className="legal-h2">Hukum yang Berlaku</h2>
                                <p className="legal-p">
                                    Ketentuan ini diatur oleh dan ditafsirkan
                                    sesuai dengan hukum Republik Indonesia.
                                    Setiap sengketa yang timbul dari atau
                                    sehubungan dengan Ketentuan ini akan
                                    diselesaikan melalui musyawarah mufakat.
                                    Jika tidak tercapai kesepakatan, sengketa
                                    akan diselesaikan melalui pengadilan yang
                                    berwenang di Indonesia.
                                </p>
                                <div
                                    className="mt-5 rounded-2xl p-6"
                                    style={{
                                        background: 'var(--singgah-green-50)',
                                        border: '1.5px solid var(--singgah-green-100)',
                                    }}
                                >
                                    <p className="mb-2 font-semibold text-gray-900">
                                        Hubungi Kami
                                    </p>
                                    <p className="normal-font-size text-gray-600">
                                        Pertanyaan terkait Ketentuan ini dapat
                                        dikirimkan ke:
                                    </p>
                                    <p className="normal-font-size mt-2 text-gray-600">
                                        📧{' '}
                                        <a
                                            href="mailto:halo@singgah.id"
                                            className="underline hover:no-underline"
                                            style={{
                                                color: 'var(--singgah-green-700)',
                                            }}
                                        >
                                            halo@singgah.id
                                        </a>
                                    </p>
                                    <p className="small-font-size mt-3 text-gray-500">
                                        Kami berkomitmen merespons dalam 14 hari
                                        kerja.
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
