# Singgah

Platform desa wisata Indonesia berbasis web untuk membantu wisatawan menemukan destinasi lokal, sekaligus memberdayakan pengelola desa mengelola profil digitalnya secara mandiri.

Slogan: **Jelajahi Keindahan Desa**

## Ringkasan Nonteknis

### Latar Belakang

Indonesia memiliki ribuan desa wisata dan UMKM lokal yang potensinya besar, tetapi informasi digitalnya sering tersebar, tidak terstandarisasi, dan sulit ditemukan wisatawan.

### Masalah yang Ingin Diselesaikan

- Wisatawan kesulitan menemukan informasi desa wisata dalam satu tempat.
- Pengelola desa belum punya CMS sederhana untuk mengelola konten sendiri.
- UMKM lokal (kuliner, penginapan, atraksi) kurang visibilitas digital.

### Solusi Singgah

Singgah menghadirkan satu platform terpusat yang menggabungkan:

- Direktori desa wisata yang terstruktur dan mudah dicari.
- CMS untuk pengelola desa mengelola konten secara mandiri.
- Moderasi admin untuk menjaga kualitas informasi.
- Asisten AI berbasis RAG untuk rekomendasi wisata yang relevan.

### Dampak yang Dituju

- Sosial: meningkatkan awareness terhadap desa wisata Indonesia.
- Ekonomi: membuka kanal promosi digital baru untuk UMKM lokal.
- Teknologi: mendorong digitalisasi pariwisata berbasis komunitas.

## Target Pengguna dan Peran

- **Pengunjung (Visitor)**
    - Menjelajah desa, event, wisata, kuliner, akomodasi.
    - Memberi ulasan dan rating.
    - Menyimpan wishlist destinasi.
    - Menggunakan AI Travel Assistant.

- **Pengelola Desa (Manager)**
    - Mengelola profil desa.
    - CRUD atraksi, kuliner, akomodasi, event, dan media.
    - Memantau ulasan.

- **Super Admin**
    - Verifikasi desa dan moderasi konten.
    - Manajemen pengguna.
    - Monitoring keseluruhan platform.

## Fitur Utama

### Halaman Publik

- Beranda (`/`): hero, kategori, desa pilihan, wilayah, desa terbaru.
- Explore (`/explore`): filter pencarian, wilayah, kategori, rating minimum, sort.
- Profil desa (`/desa/{slug}`): tab beranda, event, wisata, kuliner, akomodasi, ulasan.
- Detail konten:
    - `/desa/{slug}/events/{itemSlug}`
    - `/desa/{slug}/attractions/{itemSlug}`
    - `/desa/{slug}/culinaries/{itemSlug}`
    - `/desa/{slug}/accommodations/{itemSlug}`
- Halaman statis: `/tentang`, `/privasi`, `/syarat`.

### Fitur Akun dan Interaksi

- Login/register berbasis Laravel Fortify.
- Register pengelola desa: `/register/pengelola`.
- Profil pengguna: `/profil`, `/profil/keamanan`, `/profil/ulasan`, `/profil/wishlist`.
- Review polymorphic (desa/konten), wishlist toggle, dan rating agregat.

### Dashboard Khusus

- Manager dashboard: prefiks route `/manager/*`.
- Admin dashboard: prefiks route `/admin/*`.

### AI Travel Assistant

- Endpoint: `POST /ai/chat`.
- Rate limit: `30 request/menit`.
- Batas pesan: maksimal `500` karakter.
- Menggunakan pendekatan RAG: data kontekstual dari database dikirim ke model AI untuk jawaban relevan.

## Arsitektur Teknis

### Stack

- Backend: Laravel 12 (PHP 8.2+)
- Frontend: React 19 + Inertia.js + TypeScript
- Styling: Tailwind CSS 4 + Shadcn UI + Radix UI
- Build tool: Vite 7
- Database: PostgreSQL (direkomendasikan untuk fitur query saat ini)
- Auth: Laravel Fortify (email verification, reset password, 2FA)
- Test: Pest + PHPUnit

### Pola Arsitektur

- Controller tipis (handling request/response).
- Validasi menggunakan Form Request (kecuali beberapa endpoint sederhana).
- Business logic dipisah ke action/service.
- Query memanfaatkan scope (`verified()`, `featured()`) dan eager loading.
- Relasi polymorphic untuk media, review, dan wishlist.

### Catatan Penting Database

Beberapa query menggunakan operator `ilike` (case-insensitive PostgreSQL), sehingga konfigurasi `DB_CONNECTION=pgsql` sangat disarankan untuk konsistensi fitur pencarian/filter.

## Skema Data Inti

Entitas utama:

- `users`
- `villages`
- `village_events`
- `attractions`
- `culinaries`
- `accommodations`
- `reviews` (polymorphic)
- `media` (polymorphic)
- `wishlists` (polymorphic)

## Struktur Folder Singkat

```text
app/
  Http/Controllers/        # Public, Auth, Manager, Admin controllers
  Http/Requests/           # Form Request validation
  Models/                  # Eloquent models
  Services/                # AiRagService, dll.

resources/
  js/pages/                # Halaman Inertia (home, explore, auth, manager, admin)
  js/layouts/              # Public layout + auth layout
  css/                     # Design system + utility class

routes/
  web.php                  # Public, auth, manager, admin routes
  settings.php             # User settings routes

database/
  migrations/              # Struktur database
  seeders/                 # Data dummy/demo
```

## Setup Lokal

### Prasyarat

- PHP 8.2+
- Composer 2+
- Node.js 20+ dan npm
- PostgreSQL 14+ (direkomendasikan)

### 1) Instalasi Dependensi

```bash
composer install
npm install
```

### 2) Konfigurasi Environment

```bash
cp .env.example .env
php artisan key:generate
```

Update nilai database di `.env` (contoh PostgreSQL):

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=singgah
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

Jika ingin mengaktifkan AI Assistant, tambahkan juga:

```env
SUMOPOD_API_KEY=your_api_key
```

### 3) Migrasi dan Seeding

```bash
php artisan migrate
php artisan db:seed
```

Seeder default akan membuat data contoh (admin, manager, visitor, desa, konten, media, ulasan).

### 4) Jalankan Aplikasi

Opsi praktis (server + queue + vite sekaligus):

```bash
composer run dev
```

Atau jalankan terpisah:

```bash
php artisan serve
php artisan queue:listen --tries=1
npm run dev
```

## Perintah Pengembangan

### Backend

- Format (Laravel Pint):

```bash
composer run lint
```

- Test (lint + test):

```bash
composer run test
```

### Frontend

- Build production:

```bash
npm run build
```

- Build SSR:

```bash
npm run build:ssr
```

- Cek format:

```bash
npm run format:check
```

- Lint:

```bash
npm run lint
```

- Type check:

```bash
npm run types
```

## Keamanan

- Role-based access control (admin, manager, user) via middleware.
- Endpoint mutasi dilindungi CSRF dan validasi request.
- Upload media dibatasi tipe file dan ukuran melalui Form Request.
- Fortify: email verification, reset password, two-factor authentication.

## Status Implementasi

Komponen utama yang sudah tersedia:

- Public pages (beranda, explore, profil desa, detail konten, statis).
- CMS manager (profil desa, event, atraksi, kuliner, akomodasi, media).
- Admin panel (dashboard, users, villages, konten, reviews).
- AI chat endpoint dengan pendekatan RAG.
- Sistem review dan wishlist.

Fase berjalan saat ini:

- Penguatan testing, deployment, dan dokumentasi lanjutan.

## Roadmap Pengembangan

- Booking/reservasi langsung.
- Notifikasi real-time.
- Aplikasi mobile.
- Dukungan multi-bahasa.
- Analytics dashboard untuk pengelola desa.
- Peningkatan akurasi AI (semantic retrieval/embedding).

## Lisensi

Proyek ini mengikuti lisensi MIT sesuai ekosistem Laravel starter yang digunakan.

## Catatan

README ini disusun dari implementasi kode saat ini dan dokumen internal spesifikasi/proposal di repository Singgah.
