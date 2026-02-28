import { Head } from '@inertiajs/react';
import {
    BookOpen,
    Database,
    Eye,
    Lock,
    Mail,
    RefreshCw,
    Shield,
    UserCheck,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import PublicLayout from '@/layouts/PublicLayout';

const sections = [
    { id: 'pengantar', label: 'Pengantar' },
    { id: 'data-dikumpulkan', label: 'Data yang Dikumpulkan' },
    { id: 'penggunaan-data', label: 'Penggunaan Data' },
    { id: 'berbagi-data', label: 'Berbagi Data' },
    { id: 'keamanan', label: 'Keamanan Data' },
    { id: 'hak-pengguna', label: 'Hak-Hak Anda' },
    { id: 'pengelola', label: 'Ketentuan Pengelola Desa' },
    { id: 'cookie', label: 'Cookie & Pelacak' },
    { id: 'perubahan', label: 'Perubahan Kebijakan' },
    { id: 'kontak', label: 'Hubungi Kami' },
];

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

export default function Privacy() {
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
            <Head title="Kebijakan Privasi — Singgah" />

            {/* Hero */}
            <section className="hero-gradient relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20">
                <div className="absolute inset-0 opacity-[0.05]" aria-hidden>
                    <svg
                        className="h-full w-full"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <pattern
                                id="priv-pat"
                                x="0"
                                y="0"
                                width="60"
                                height="60"
                                patternUnits="userSpaceOnUse"
                            >
                                <rect
                                    x="15"
                                    y="15"
                                    width="30"
                                    height="30"
                                    rx="6"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1"
                                />
                            </pattern>
                        </defs>
                        <rect
                            width="100%"
                            height="100%"
                            fill="url(#priv-pat)"
                        />
                    </svg>
                </div>
                <div className="section-padding-x relative z-10 text-center">
                    <div className="container max-w-4xl">
                        <div
                            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                            style={{ background: 'rgba(255,255,255,0.15)' }}
                        >
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <h1
                            className="mb-3 leading-tight font-extrabold text-white"
                            style={{
                                fontFamily: 'var(--font-jakarta)',
                                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                            }}
                        >
                            Kebijakan Privasi
                        </h1>
                        <p
                            className="normal-font-size mb-3"
                            style={{ color: 'rgba(255,255,255,0.75)' }}
                        >
                            Kami berkomitmen melindungi privasi dan keamanan
                            data Anda.
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

            {/* Mobile TOC */}
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

            {/* Content */}
            <section className="section-padding-x bg-white py-12">
                <div className="container max-w-7xl">
                    <div className="flex items-start gap-10">
                        {/* Desktop Sidebar TOC */}
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

                        {/* Article */}
                        <article className="max-w-3xl min-w-0 flex-1">
                            <div id="pengantar" className="legal-section">
                                <h2 className="legal-h2">Pengantar</h2>
                                <p className="legal-p">
                                    Selamat datang di Singgah. Kebijakan Privasi
                                    ini menjelaskan bagaimana kami mengumpulkan,
                                    menggunakan, menyimpan, dan melindungi
                                    informasi pribadi Anda ketika menggunakan
                                    layanan platform Singgah di{' '}
                                    <strong>singgah.id</strong>.
                                </p>
                                <p className="legal-p">
                                    Dengan menggunakan layanan Singgah, Anda
                                    menyetujui pengumpulan dan penggunaan
                                    informasi sesuai Kebijakan ini. Kebijakan
                                    berlaku untuk semua pengguna, termasuk{' '}
                                    <strong>Pengunjung</strong> dan{' '}
                                    <strong>Pengelola Desa</strong>, dengan
                                    ketentuan tambahan untuk Pengelola Desa pada
                                    bagian khusus di bawah.
                                </p>
                            </div>

                            <div
                                id="data-dikumpulkan"
                                className="legal-section"
                            >
                                <h2 className="legal-h2">
                                    Informasi yang Kami Kumpulkan
                                </h2>
                                <h3 className="legal-h3">
                                    2.1 Informasi yang Anda Berikan Langsung
                                </h3>
                                <ul className="legal-ul">
                                    <li>
                                        <strong>Akun:</strong> Nama, email, kata
                                        sandi (terenkripsi), nomor telepon
                                        (opsional), foto profil (opsional).
                                    </li>
                                    <li>
                                        <strong>Profil Desa:</strong> Nama desa,
                                        deskripsi, alamat, koordinat,
                                        foto/video, dan kontak (khusus Pengelola
                                        Desa).
                                    </li>
                                    <li>
                                        <strong>Ulasan:</strong> Rating dan teks
                                        komentar pada profil desa.
                                    </li>
                                    <li>
                                        <strong>Komunikasi:</strong> Pesan
                                        melalui formulir kontak atau email
                                        dukungan.
                                    </li>
                                </ul>
                                <h3 className="legal-h3">
                                    2.2 Informasi yang Dikumpulkan Otomatis
                                </h3>
                                <ul className="legal-ul">
                                    <li>
                                        <strong>Data Penggunaan:</strong>{' '}
                                        Halaman dikunjungi, waktu kunjungan,
                                        fitur digunakan, riwayat pencarian.
                                    </li>
                                    <li>
                                        <strong>Data Teknis:</strong> Alamat IP,
                                        jenis browser, sistem operasi,
                                        identifikator perangkat.
                                    </li>
                                    <li>
                                        <strong>Cookie:</strong> Data sesi dan
                                        preferensi pengguna (lihat bagian
                                        Cookie).
                                    </li>
                                </ul>
                            </div>

                            <div id="penggunaan-data" className="legal-section">
                                <h2 className="legal-h2">
                                    Cara Kami Menggunakan Informasi
                                </h2>
                                <ul className="legal-ul">
                                    <li>
                                        Menyediakan, mengoperasikan, dan
                                        meningkatkan layanan platform.
                                    </li>
                                    <li>
                                        Memverifikasi identitas dan mencegah
                                        penipuan atau penyalahgunaan.
                                    </li>
                                    <li>
                                        Mengirimkan notifikasi terkait akun dan
                                        pembaruan platform yang relevan.
                                    </li>
                                    <li>
                                        Memberikan rekomendasi wisata personal
                                        melalui fitur AI Travel Assistant.
                                    </li>
                                    <li>
                                        Menganalisis pola penggunaan untuk
                                        meningkatkan pengalaman pengguna.
                                    </li>
                                    <li>
                                        Memenuhi kewajiban hukum yang berlaku di
                                        Indonesia.
                                    </li>
                                </ul>
                                <p className="legal-p">
                                    Kami <strong>tidak</strong> menjual atau
                                    menggunakan data Anda untuk pemasaran pihak
                                    ketiga tanpa persetujuan eksplisit Anda.
                                </p>
                            </div>

                            <div id="berbagi-data" className="legal-section">
                                <h2 className="legal-h2">
                                    Berbagi & Pengungkapan Data
                                </h2>
                                <p className="legal-p">
                                    Singgah <strong>tidak menjual</strong> data
                                    pribadi Anda. Kami hanya berbagi informasi
                                    dalam situasi berikut:
                                </p>
                                <ul className="legal-ul">
                                    <li>
                                        <strong>Penyedia Layanan:</strong> Pihak
                                        ketiga yang membantu operasional
                                        platform (cloud, analitik) dengan
                                        jaminan kerahasiaan.
                                    </li>
                                    <li>
                                        <strong>Kewajiban Hukum:</strong> Jika
                                        diwajibkan oleh hukum atau perintah
                                        pengadilan Indonesia.
                                    </li>
                                    <li>
                                        <strong>Perlindungan Hak:</strong> Untuk
                                        melindungi hak, properti, atau
                                        keselamatan Singgah atau pengguna.
                                    </li>
                                    <li>
                                        <strong>Persetujuan Anda:</strong> Untuk
                                        tujuan lain dengan persetujuan eksplisit
                                        dari Anda.
                                    </li>
                                </ul>
                            </div>

                            <div id="keamanan" className="legal-section">
                                <h2 className="legal-h2">Keamanan Data</h2>
                                <p className="legal-p">
                                    Kami menerapkan langkah keamanan teknis dan
                                    organisasional yang wajar, termasuk:
                                </p>
                                <ul className="legal-ul">
                                    <li>
                                        Enkripsi kata sandi menggunakan
                                        algoritma bcrypt.
                                    </li>
                                    <li>
                                        Koneksi HTTPS (TLS) untuk semua
                                        transmisi data.
                                    </li>
                                    <li>
                                        Akses database yang dibatasi berbasis
                                        peran (RBAC).
                                    </li>
                                    <li>Audit log untuk aktivitas sensitif.</li>
                                </ul>
                                <p className="legal-p">
                                    Tidak ada sistem yang 100% aman. Anda
                                    bertanggung jawab menjaga kerahasiaan
                                    kredensial akun Anda.
                                </p>
                            </div>

                            <div id="hak-pengguna" className="legal-section">
                                <h2 className="legal-h2">Hak-Hak Anda</h2>
                                <p className="legal-p">
                                    Sesuai peraturan perlindungan data di
                                    Indonesia, Anda berhak:
                                </p>
                                <ul className="legal-ul">
                                    <li>
                                        <strong>Akses:</strong> Meminta salinan
                                        data pribadi yang kami simpan.
                                    </li>
                                    <li>
                                        <strong>Perbaikan:</strong> Meminta
                                        koreksi data tidak akurat melalui
                                        pengaturan akun.
                                    </li>
                                    <li>
                                        <strong>Penghapusan:</strong> Meminta
                                        penghapusan akun dan data pribadi.
                                    </li>
                                    <li>
                                        <strong>Portabilitas:</strong> Menerima
                                        data dalam format yang dapat dibaca
                                        mesin.
                                    </li>
                                    <li>
                                        <strong>Keberatan:</strong> Mengajukan
                                        keberatan atas pemrosesan data tertentu.
                                    </li>
                                </ul>
                                <p className="legal-p">
                                    Hubungi kami di{' '}
                                    <strong>halo@singgah.id</strong> untuk
                                    menggunakan hak-hak Anda.
                                </p>
                            </div>

                            <div id="pengelola" className="legal-section">
                                <h2 className="legal-h2">
                                    Ketentuan Khusus: Pengelola Desa
                                </h2>
                                <span className="role-badge role-badge-manager">
                                    🌿 Khusus Pengelola Desa
                                </span>
                                <h3 className="legal-h3">
                                    7.1 Tanggung Jawab Konten
                                </h3>
                                <p className="legal-p">
                                    Anda bertanggung jawab atas keakuratan,
                                    kelengkapan, dan keabsahan semua informasi
                                    yang Anda unggah tentang desa Anda, termasuk
                                    foto, video, deskripsi, dan kontak.
                                </p>
                                <h3 className="legal-h3">
                                    7.2 Data Pengunjung
                                </h3>
                                <p className="legal-p">
                                    Singgah dapat menampilkan statistik
                                    kunjungan agregat kepada Anda. Anda{' '}
                                    <strong>tidak</strong> mendapatkan akses ke
                                    data pribadi pengunjung individual kecuali
                                    informasi yang diberikan secara sukarela
                                    melalui ulasan publik.
                                </p>
                                <h3 className="legal-h3">
                                    7.3 Konten Pihak Ketiga
                                </h3>
                                <p className="legal-p">
                                    Jika konten yang Anda unggah memuat data
                                    pribadi pihak ketiga (misalnya foto yang
                                    menampilkan wajah seseorang), Anda wajib
                                    memastikan telah mendapat persetujuan dari
                                    pihak tersebut sebelum mengunggahnya.
                                </p>
                                <h3 className="legal-h3">
                                    7.4 Penghapusan Akun Pengelola
                                </h3>
                                <p className="legal-p">
                                    Jika akun Pengelola Desa dihapus atau
                                    dinonaktifkan, konten yang terkait akan
                                    ditinjau dan mungkin dihapus dalam 30 hari,
                                    kecuali ada kewajiban penyimpanan
                                    berdasarkan hukum.
                                </p>
                            </div>

                            <div id="cookie" className="legal-section">
                                <h2 className="legal-h2">
                                    Cookie & Teknologi Pelacak
                                </h2>
                                <ul className="legal-ul">
                                    <li>
                                        <strong>Cookie Esensial:</strong>{' '}
                                        Diperlukan untuk fungsi dasar platform
                                        (autentikasi sesi, keamanan CSRF).
                                    </li>
                                    <li>
                                        <strong>Cookie Analitik:</strong> Data
                                        anonim dan agregat untuk memahami pola
                                        penggunaan.
                                    </li>
                                    <li>
                                        <strong>Cookie Preferensi:</strong>{' '}
                                        Menyimpan pilihan Anda seperti bahasa
                                        dan tampilan.
                                    </li>
                                </ul>
                                <p className="legal-p">
                                    Anda dapat mengontrol cookie melalui
                                    pengaturan browser. Menonaktifkan cookie
                                    esensial dapat memengaruhi fungsionalitas
                                    platform.
                                </p>
                            </div>

                            <div id="perubahan" className="legal-section">
                                <h2 className="legal-h2">
                                    Perubahan Kebijakan Privasi
                                </h2>
                                <p className="legal-p">
                                    Kami dapat memperbarui Kebijakan Privasi ini
                                    dari waktu ke waktu. Perubahan material akan
                                    diumumkan melalui email atau notifikasi di
                                    platform setidaknya 7 hari sebelum berlaku.
                                    Penggunaan layanan yang berkelanjutan
                                    setelah tanggal efektif dianggap sebagai
                                    persetujuan Anda.
                                </p>
                            </div>

                            <div id="kontak" className="legal-section">
                                <h2 className="legal-h2">Hubungi Kami</h2>
                                <p className="legal-p">
                                    Jika Anda memiliki pertanyaan atau
                                    permintaan terkait Kebijakan Privasi ini,
                                    silakan hubungi:
                                </p>
                                <div
                                    className="mt-4 rounded-2xl p-6"
                                    style={{
                                        background: 'var(--singgah-green-50)',
                                        border: '1.5px solid var(--singgah-green-100)',
                                    }}
                                >
                                    <p className="mb-2 font-semibold text-gray-900">
                                        Tim Privasi Singgah
                                    </p>
                                    <p className="normal-font-size text-gray-600">
                                        📧{' '}
                                        <a
                                            href="mailto:privasi@singgah.id"
                                            className="underline"
                                            style={{
                                                color: 'var(--singgah-green-700)',
                                            }}
                                        >
                                            privasi@singgah.id
                                        </a>
                                    </p>
                                    <p className="normal-font-size mt-1 text-gray-600">
                                        🌐 singgah.id
                                    </p>
                                    <p className="small-font-size mt-3 text-gray-500">
                                        Kami akan merespons dalam maksimal 14
                                        hari kerja.
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
