# PROPOSAL IDE KARYA
## Kompetisi Web Development FUSHIONTECH X KOMIK 2026

---

> **Judul Karya:** Singgah — Platform Desa Wisata & Ekonomi Kreatif Indonesia Berbasis AI
> **Subtema:** Tourism, Event & Smart City Platform
> **Kategori:** Tim (maks. 3 orang)

---

## BAB I: LATAR BELAKANG & IDENTIFIKASI MASALAH

### 1.1 Latar Belakang

Pariwisata desa (rural tourism) merupakan salah satu sektor yang memiliki potensi besar dalam mendorong ekonomi lokal dan pemberdayaan masyarakat pedesaan di Indonesia. Indonesia memiliki lebih dari 1.800 desa wisata yang tersebar dari Sabang sampai Merauke, namun sebagian besar masih minim digitalisasi dan sulit ditemukan oleh wisatawan potensial.

Kesenjangan digital ini menimbulkan beberapa permasalahan nyata:

1. **Bagi Wisatawan:** Tidak ada platform terpusat untuk menemukan desa wisata yang sesuai minat dan anggaran. Informasi tersebar di berbagai kanal yang tidak terstandarisasi (Instagram, blog perjalanan, word of mouth).

2. **Bagi Pengelola Desa:** Desa wisata tidak memiliki sarana digital mandiri untuk mempromosikan destinasi, atraksi, kuliner, akomodasi, dan event mereka. Ketergantungan pada pihak ketiga (travel agent, media) menciptakan asimetri informasi dan pengurangan pendapatan.

3. **Bagi Ekosistem UMKM:** Pelaku usaha kecil di sekitar desa (kuliner, kerajinan, homestay) tidak memiliki visibilitas digital, sehingga kehilangan potensi pasar wisatawan yang terus berkembang.

### 1.2 Rumusan Masalah

- Bagaimana membangun platform digital terpadu yang mampu mempromosikan potensi desa wisata Indonesia secara efektif?
- Bagaimana memberdayakan pengelola desa agar dapat mengelola konten digital mereka secara mandiri tanpa perlu keahlian teknis khusus?
- Bagaimana memanfaatkan kecerdasan buatan (AI) untuk memberikan rekomendasi wisata yang personal dan relevan kepada wisatawan?

### 1.3 Tujuan

- Membangun ekosistem digital yang menghubungkan wisatawan dengan desa wisata Indonesia secara langsung.
- Menyediakan CMS (Content Management System) yang mudah digunakan bagi pengelola desa.
- Mengimplementasikan AI Travel Assistant berbasis RAG (Retrieval-Augmented Generation) untuk pengalaman pencarian yang cerdas.
- Mendorong pertumbuhan ekonomi lokal melalui peningkatan eksposur digital UMKM desa.

---

## BAB II: SOLUSI & INOVASI

### 2.1 Deskripsi Solusi

**Singgah** (*"Jelajahi Keindahan Desa"*) adalah platform web berbasis multi-peran yang dirancang sebagai pusat digital ekosistem pariwisata desa Indonesia. Platform ini tidak sekadar menjadi direktori desa, melainkan sebuah sistem manajemen konten terintegrasi yang dilengkapi dengan kecerdasan buatan.

### 2.2 Keunggulan & Diferensiasi

| Aspek | Solusi Konvensional | Singgah |
|---|---|---|
| **Penemuan Destinasi** | Google Search / Blog | Explore terstruktur dengan filter multi-dimensi |
| **Informasi Desa** | Info statis, tidak terupdate | CMS real-time dikelola langsung oleh desa |
| **Rekomendasi** | Artikel listicle generik | AI Travel Assistant berbasis data database nyata (RAG) |
| **UMKM** | Tidak terdaftar digital | Terintegrasi dalam profil desa (kuliner, akomodasi) |
| **Verifikasi Konten** | Tidak ada | Admin verification workflow |
| **Ulasan** | Tersebar di berbagai platform | Terpusat, terikat ke entitas spesifik (desa/atraksi/dll.) |

### 2.3 Dampak yang Diharapkan

- **Sosial:** Peningkatan kesadaran wisatawan terhadap potensi desa wisata lokal
- **Ekonomi:** Membuka kanal distribusi digital baru bagi UMKM desa
- **Teknologi:** Menjadi model percontohan digitalisasi pariwisata berbasis komunitas

---

## BAB III: ARSITEKTUR & TEKNOLOGI SISTEM

### 3.1 Stack Teknologi

#### Backend
| Komponen | Teknologi | Versi |
|---|---|---|
| Framework | Laravel | 12.x |
| Bahasa | PHP | 8.2+ |
| Autentikasi | Laravel Fortify | ^1.30 |
| Server-side Rendering | Inertia.js (Laravel Adapter) | ^2.0 |
| API Routing | Laravel Wayfinder | ^0.1.9 |

#### Frontend
| Komponen | Teknologi | Versi |
|---|---|---|
| UI Framework | React | ^19.x |
| Bundler | Vite | ^7.x |
| Styling | TailwindCSS | ^4.x |
| Komponen UI | Shadcn/UI + Radix UI | Latest |
| Rich Text Editor | Tiptap | ^3.x |
| Ikon | Lucide React | ^0.475 |

#### Database & AI
| Komponen | Teknologi |
|---|---|
| Database | PostgreSQL |
| AI Integration | OpenAI-compatible API (via SumoPod) |
| AI Approach | RAG (Retrieval-Augmented Generation) |

### 3.2 Arsitektur Sistem

```
┌────────────────────────────────────────────────────────┐
│                   CLIENT (Browser)                       │
│            React + Inertia.js + TailwindCSS              │
└────────────────────┬───────────────────────────────────┘
                     │ Inertia Protocol (server-side props)
┌────────────────────▼───────────────────────────────────┐
│                LARAVEL 12 BACKEND                        │
│                                                          │
│  Controllers → Form Requests → Action Classes → Models  │
│                                                          │
│  ┌──────────────┐    ┌──────────────┐                   │
│  │ Public API   │    │ Admin/Manager│                   │
│  │ (Explore,    │    │ CMS API      │                   │
│  │  Village,    │    │ (CRUD, Media,│                   │
│  │  AI Chat)    │    │  Verifikasi) │                   │
│  └──────────────┘    └──────────────┘                   │
└────────────────────┬───────────────────────────────────┘
                     │
         ┌───────────┴──────────┐
         │                      │
┌────────▼────────┐   ┌─────────▼────────┐
│   PostgreSQL    │   │   External AI API │
│   Database      │   │   (OpenAI-compat) │
│                 │   │                   │
│ 12 tabel dengan │   │ RAG: DB context   │
│ relasi polimorf │   │ → AI response     │
└─────────────────┘   └──────────────────┘
```

### 3.3 Pola Arsitektur Backend

Platform mengadopsi pola arsitektur berlapis yang bersih:

- **Skinny Controllers:** Controller hanya menangani HTTP request/response, tanpa business logic
- **Form Requests:** Validasi terpusat di kelas Form Request dengan pesan error Bahasa Indonesia
- **Action Pattern:** Business logic dienkapsulasi dalam Action classes (e.g., `CreateVillageAction`)
- **Scope Pattern:** Query database diabstraksikan via Eloquent Scopes (`verified()`, `featured()`)
- **Eager Loading:** Selalu menggunakan `with()` untuk mencegah masalah N+1 query

### 3.4 Skema Database

```
users ──────────────────────────────────────┐
  ├── id, name, email, role (admin/manager/user)   │
  ├── avatar, phone, address                 │
  └── two_factor_secret (2FA Fortify)        │
                                              │
villages ───────────────────────────────────┘ (manager_id FK)
  ├── id, slug, name, category
  ├── short_description, description (rich text)
  ├── address, map_url
  ├── status (pending/verified/rejected)
  ├── is_featured
  └── [relasi polimorfik media]

village_events ─── FK: village_id
attractions    ─── FK: village_id
culinaries     ─── FK: village_id  
accommodations ─── FK: village_id
  └── name, description, price_min, price_max,
      location, contact_info, operating_hours

reviews ─── FK: user_id + polymorphic (village/attraction/accommodation)
  └── rating (1-5), comment, is_visible

media ─── polymorphic (mediable_id, mediable_type)
  └── file_path, type (image/video)
```

---

## BAB IV: FITUR UTAMA APLIKASI

### 4.1 Ringkasan Fitur per Peran

Platform melayani tiga peran utama dengan fitur yang saling melengkapi:

```
SINGGAH PLATFORM
│
├── 🌍 PENGUNJUNG (Visitor)
│   ├── Beranda dengan Featured Villages & Stats
│   ├── Halaman Jelajahi (Explore) dengan Filter Multi-Dimensi
│   ├── Profil Desa Lengkap (Tab: Beranda, Event, Wisata, Kuliner, Akomodasi, Ulasan)
│   ├── Halaman Detail Konten (Atraksi, Kuliner, Akomodasi, Event)
│   ├── Sistem Ulasan & Rating (Polymorphic, max 1/entitas)
│   ├── AI Travel Assistant (Chatbot berbasis RAG)
│   └── Halaman Publik (Tentang, Privasi, Syarat)
│
├── 🏘️ PENGELOLA DESA (Village Manager)
│   ├── Dashboard Statistik (jumlah konten, ulasan, status)
│   ├── Manajemen Profil Desa (CRUD + Rich Text Editor Tiptap)
│   ├── Manajemen Galeri Media (upload foto/video, drag-reorder)
│   ├── Manajemen Event (CRUD + media event)
│   ├── Manajemen Wisata/Atraksi (CRUD + media)
│   ├── Manajemen Kuliner/UMKM (CRUD + media)
│   ├── Manajemen Akomodasi (CRUD + media)
│   └── Monitoring Ulasan
│
└── 🛡️ SUPER ADMIN
    ├── Dashboard Admin (statistik platform)
    ├── Manajemen Pengguna (CRUD semua user)
    ├── Verifikasi & Moderasi Desa (approve/reject/verify)
    ├── Moderasi Ulasan (tampilkan/sembunyikan)
    └── Manajemen Konten (Atraksi, Kuliner, Akomodasi, Event)
```

### 4.2 Detail Fitur Publik

#### 4.2.1 Beranda (/)

- **Hero Section:** Headline utama, sub-headline, search bar terintegrasi, 2 CTA button, strip statistik real-time (jumlah desa terverifikasi, provinsi, pengunjung terdaftar). Background: green gradient dengan pola batik SVG.
- **Kategori Desa:** 6 kategori (Wisata Alam, Budaya & Tradisi, Kuliner Lokal, Agrowisata, Pesisir & Bahari, Desa Kreatif) dengan navigasi seamless ke halaman Explore.
- **Desa Pilihan (Featured):** 8 card desa terpilih (`is_featured=true`) dengan data real dari database.
- **Jelajahi per Wilayah:** 8 kartu wilayah besar Indonesia (Bali, Yogyakarta, Lombok, Jawa Barat, Danau Toba, Toraja, Flores, Kalimantan Timur).
- **Desa Terbaru:** 8 card desa terbaru yang baru terverifikasi.
- **CTA Pendaftaran:** Banner ajakan mendaftarkan desa.

#### 4.2.2 Halaman Jelajahi (/explore)

- **Filter Multi-Dimensi:** Pencarian teks, filter wilayah/provinsi, sort (terbaru/rating/nama), filter rating minimum.
- **Sync URL Query String:** Semua filter tersimpan di URL → bookmarkable & shareable.
- **Responsive Layout:** Desktop — sidebar filter sticky + grid 3-4 kolom; Mobile — tombol filter buka bottom sheet.
- **Smart Pagination:** 12 desa/halaman.

#### 4.2.3 Profil Desa (/desa/:slug)

- **Layout:** Sticky sidebar kiri + scrollable main content
- **Informasi Sidebar:** Cover image, nama desa, aggregate rating, info pengelola, alamat lengkap
- **Tab Navigasi:** 6 tab — Beranda | Event | Wisata | Kuliner | Akomodasi | Ulasan
  - **Tab Beranda:** Rich text description, galeri foto dengan lightbox, Google Maps embed, highlight event & wisata terkini
  - **Tab Event:** Daftar event dengan toggle Mendatang/Semua, sorted by date
  - **Tab Wisata/Kuliner/Akomodasi:** Grid card konten → klik ke halaman detail
  - **Tab Ulasan:** Breakdown rating aggregate (bar chart bintang), daftar semua review, form tambah ulasan (auth required)

#### 4.2.4 Halaman Detail Konten

Route: `/desa/{slug}/{type}/{id}` (type: wisata/kuliner/akomodasi/event)
- Galeri media (foto/video)
- Deskripsi rich text lengkap
- Info harga (min-max) dengan format Rupiah
- Info kontak dan jam operasional
- Lokasi
- Form ulasan (untuk wisata & akomodasi)

#### 4.2.5 AI Travel Assistant

- **Teknologi:** RAG (Retrieval-Augmented Generation) — mengambil data relawan dari PostgreSQL, menyusunnya sebagai konteks, lalu mengirim ke AI API.
- **Kemampuan:** Merekomendasikan desa, wisata, kuliner, akomodasi, dan event berdasarkan preferensi pengguna dalam Bahasa Indonesia.
- **Keamanan:** Strict prompt engineering mencegah AI mengarang informasi di luar database.
- **Batasan Cerdas:** AI hanya menjawab berdasarkan data nyata di platform, bukan informasi generik.

### 4.3 Detail Fitur CMS Pengelola Desa

#### 4.3.1 Dashboard Manager

- Ringkasan statistik: total konten per kategori, total ulasan, status verifikasi desa
- Quick actions: tambah event, tambah wisata, dll.
- Status approval desa (pending/verified/rejected)

#### 4.3.2 Manajemen Profil Desa

- Edit informasi dasar desa (nama, kategori, deskripsi singkat)
- Rich text editor (Tiptap) untuk deskripsi panjang dengan format heading, bold, italic, list, link
- Upload cover image & galeri (validasi MIME type, ukuran, jumlah file)
- Update URL embed Google Maps
- Manajemen media: tambah/hapus foto/video dengan batas kuantitas

#### 4.3.3 Manajemen Konten (Atraksi/Kuliner/Akomodasi/Event)

Setiap kategori konten memiliki CRUD lengkap dengan:
- Nama, deskripsi rich text, lokasi, informasi kontak
- Range harga (min-max)
- Jam operasional (untuk akomodasi)
- Tanggal event (untuk event)
- Galeri media terdedikasi per item konten

### 4.4 Detail Fitur Admin

- **Dashboard:** Statistik platform (total desa, pengguna, konten, ulasan pending)
- **Manajemen Pengguna:** View semua user, edit role, suspend akun
- **Verifikasi Desa:** Antrian desa pending → review → approve/reject dengan catatan
- **Moderasi Ulasan:** Toggle visibilitas ulasan (is_visible)
- **Manajemen Konten:** Kemampuan edit/hapus konten yang dilaporkan

---

## BAB V: ANTARMUKA & DESAIN (UI/UX)

### 5.1 Sistem Desain

**Tema:** Natural, fresh, dan terpercaya — mencerminkan keindahan alam dan keramahan budaya Indonesia.

**Palet Warna:**
| Token | Warna | Fungsi |
|---|---|---|
| `--singgah-green-*` | Hijau alam | Primary — CTA, aksi utama |
| `--singgah-teal-*` | Teal | Secondary — highlight, badge |
| `--singgah-earth-*` | Earthy/krem | Accent — nuansa lokal |
| `--singgah-sky-*` | Biru langit | Info, link |

**Tipografi:** Font sistem modern (Inter/Outfit) dengan skala tipografi yang konsisten dan terstandarisasi via CSS variables.

### 5.2 Prinsip UI/UX

1. **Aksesibilitas Lintas Demografi:** Desain simpel dan intuitif yang dapat digunakan oleh semua kalangan usia, termasuk pengelola desa yang mungkin tidak melek teknologi.
2. **Responsive First:** Semua halaman dioptimalkan untuk desktop dan mobile. Mobile: bottom sheet filter, hamburger nav, single-column layout.
3. **Konsistensi Design System:** Semua elemen (button, card, input, badge) menggunakan utility class dan CSS variable yang terdefinisi — tidak ada hardcode nilai warna/ukuran.
4. **State Feedback:** Loading state, toast notification (Sonner), error state, dan empty state tersedia di setiap komponen interaktif.

### 5.3 Halaman Lengkap yang Tersedia

| Halaman | Route | Akses |
|---|---|---|
| Beranda | `/` | Publik |
| Jelajahi Desa | `/explore` | Publik |
| Profil Desa | `/desa/:slug` | Publik |
| Detail Atraksi | `/desa/:slug/wisata/:id` | Publik |
| Detail Kuliner | `/desa/:slug/kuliner/:id` | Publik |
| Detail Akomodasi | `/desa/:slug/akomodasi/:id` | Publik |
| Detail Event | `/desa/:slug/event/:id` | Publik |
| Tentang Kami | `/tentang` | Publik |
| Kebijakan Privasi | `/privasi` | Publik |
| Syarat & Ketentuan | `/syarat` | Publik |
| Login | `/login` | Publik |
| Register | `/register` | Publik |
| Profil Pengguna | `/profil` | Auth (semua) |
| Dashboard Manager | `/manager/dashboard` | Manager |
| CMS Desa | `/manager/village` | Manager |
| CMS Atraksi | `/manager/attractions` | Manager |
| CMS Kuliner | `/manager/culinaries` | Manager |
| CMS Akomodasi | `/manager/accommodations` | Manager |
| CMS Event | `/manager/events` | Manager |
| Dashboard Admin | `/admin/dashboard` | Admin |
| Manajemen User | `/admin/users` | Admin |
| Verifikasi Desa | `/admin/villages` | Admin |
| Moderasi Ulasan | `/admin/reviews` | Admin |

---

## BAB VI: KEAMANAN & EFISIENSI SISTEM

### 6.1 Keamanan Autentikasi

- **Laravel Fortify:** Sistem autentikasi battle-tested dengan fitur:
  - Email verification
  - Two-Factor Authentication (2FA) via TOTP
  - Password reset via email
  - Confirm password untuk aksi sensitif
- **Role-Based Access Control (RBAC):** 3 role (admin, manager, user) dengan middleware proteksi per route group
- **CSRF Protection:** Laravel built-in CSRF token pada semua form mutation

### 6.2 Validasi Input

- **Form Requests:** Setiap endpoint mutation memiliki kelas Form Request tersendiri
- **Validasi MIME Type:** Upload file divalidasi MIME type (bukan hanya ekstensi)
- **Validasi Ukuran File:** Batas ukuran file di-enforce di Form Request (bukan hanya di frontend)
- **Batas Kuantitas Media:** Validasi jumlah file per entitas untuk mencegah abuse storage

### 6.3 Keamanan Data AI

- **Prompt Injection Prevention:** System prompt yang ketat mencegah manipulasi instruksi AI
- **No Hallucination Policy:** AI hanya menjawab berdasarkan data yang ada di database, bukan pengetahuan generiknya
- **Input Length Limit:** Pesan AI dibatasi 500 karakter

### 6.4 Efisiensi Database

- **Eager Loading:** Semua relasi dimuat dengan `with()` untuk mencegah N+1 queries
- **Query Scopes:** Eloquent scopes mengabstraksikan query berulang (`verified()`, `featured()`)
- **Indexed Fields:** Kolom yang sering difilter (slug, status, is_featured) diindeks

---

## BAB VII: SKALABILITAS & PENGEMBANGAN MASA DEPAN

### 7.1 Skalabilitas Teknis

Platform Singgah dirancang dengan mempertimbangkan skalabilitas jangka panjang:

- **Modular Architecture:** Pola Action/Service/DTO memudahkan penambahan fitur baru tanpa memodifikasi kode yang sudah ada
- **Polymorphic Relations:** Sistem media dan ulasan menggunakan relasi polimorfik, memungkinkan penambahan entitas baru tanpa perubahan skema besar
- **Separation of Concerns:** Frontend (React/Inertia) terpisah jelas dari backend logic, memungkinkan migrasi ke API-first atau mobile app di masa depan
- **SSR Support:** Aplikasi mendukung Server-Side Rendering (Inertia SSR) untuk performa dan SEO yang lebih baik

### 7.2 Potensi Pengembangan Lanjutan

| Fitur | Deskripsi | Dampak |
|---|---|---|
| **Sistem Pemesanan/Reservasi** | Booking langsung untuk akomodasi & tiket wisata | Monetisasi platform |
| **Notifikasi Real-time** | Push notification untuk event desa terdekat | Engagement |
| **Mobile App** | React Native dengan shared business logic | Jangkauan lebih luas |
| **Multi-bahasa** | Dukungan Bahasa Inggris untuk turis mancanegara | Pasar internasional |
| **Analytics Dashboard** | Statistik kunjungan untuk pengelola desa | Data-driven decisions |
| **AI yang lebih canggih** | Embeddings vector database untuk pencarian semantik | Akurasi rekomendasi |
| **Integrasi Peta Interaktif** | Clustering marker berbasis lokasi GPS desa | User experience |

---

## BAB VIII: RENCANA IMPLEMENTASI & TIMELINE

### 8.1 Fase Pengembangan

| Fase | Kegiatan | Status |
|---|---|---|
| **Fase 1** | Setup infrastruktur, database schema, autentikasi | ✅ Selesai |
| **Fase 2** | Public pages (Beranda, Explore, Profil Desa) | ✅ Selesai |
| **Fase 3** | CMS Manager (CRUD semua entitas + media) | ✅ Selesai |
| **Fase 4** | Admin panel (verifikasi, moderasi, manajemen user) | ✅ Selesai |
| **Fase 5** | AI Travel Assistant (RAG implementation) | ✅ Selesai |
| **Fase 6** | Review & rating system | ✅ Selesai |
| **Fase 7** | UI Polish, halaman statis, design system | ✅ Selesai |
| **Fase 8** | Testing, deployment, dokumentasi | 🔄 Dalam progres |

### 8.2 Deployment Plan

- **Hosting:** Vercel (frontend SSR) / Railway atau Fly.io (Laravel backend)
- **Database:** Supabase PostgreSQL (managed cloud database)
- **File Storage:** Cloudflare R2 / AWS S3 untuk media
- **CD/CI:** GitHub Actions untuk otomatisasi deployment

---

## BAB IX: PENUTUP

### 9.1 Kesimpulan

**Singgah** merupakan solusi digital yang komprehensif, inovatif, dan scalable untuk mengatasi tantangan digitalisasi pariwisata desa di Indonesia. Dengan menggabungkan tiga komponen utama — platform penemuan destinasi bagi wisatawan, CMS mandiri bagi pengelola desa, dan Asisten AI berbasis data nyata — Singgah menciptakan ekosistem digital yang memberi nilai nyata bagi semua pihak yang terlibat.

### 9.2 Kesesuaian dengan Kriteria Penilaian

| Kriteria Juri | Implementasi dalam Singgah | Bobot |
|---|---|---|
| **Inovasi & Relevansi** | AI Travel Assistant berbasis RAG (first-principles implementation), model pemberdayaan digital desa | 25% |
| **Arsitektur & Logika Backend** | Laravel 12 + Action Pattern + Form Requests + Scopes, PostgreSQL dengan 12 tabel terrelasi + polymorphic | 20% |
| **UI/UX** | Design system berbasis CSS variables, dual-layout responsive, 20+ halaman | 15% |
| **Keamanan & Efisiensi** | Fortify 2FA, RBAC middleware, validasi MIME/ukuran file, eager loading anti-N+1 | 15% |
| **Skalabilitas** | Arsitektur modular, polimorfik, SSR-ready, roadmap pengembangan jelas | 15% |
| **Presentasi & Dokumentasi** | Proposal + dokumentasi teknis + video demo + source code GitHub | 10% |

---

*Proposal ini dibuat sebagai panduan awal. Konten dapat disesuaikan lebih lanjut saat penulisan proposal formal.*
