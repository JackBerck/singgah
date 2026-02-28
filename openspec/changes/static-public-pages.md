# Proposal: Halaman Statis Publik — Tentang Kami, Kebijakan Privasi, Syarat & Ketentuan

## Latar Belakang

Tiga halaman publik statis dibutuhkan untuk melengkapi platform Singgah:

1. **Tentang Kami** (`/tentang`) — menjelaskan visi/misi, cara kerja, tim, FAQ, dan kontak
2. **Kebijakan Privasi** (`/privasi`) — dokumen legal data pengguna, dibedakan antara Pengunjung dan Pengelola Desa
3. **Syarat & Ketentuan** (`/syarat`) — dokumen legal penggunaan platform, dibedakan per role

Navbar sudah menautkan ke ketiga halaman ini dan footer juga sudah memiliki link-link tersebut.

---

## Perubahan yang Diusulkan

### 1. Routes & Controller

#### [MODIFY] [web.php](file:///d:/Code/singgah/routes/web.php)

Tambah 3 route GET baru di grup route publik.

#### [NEW] [StaticPageController.php](file:///d:/Code/singgah/app/Http/Controllers/StaticPageController.php)

Controller sederhana dengan 3 method:

- `about()` → render `about`
- `privacy()` → render `privacy`
- `terms()` → render `terms`

---

### 2. Halaman Tentang Kami

#### [NEW] [about.tsx](file:///d:/Code/singgah/resources/js/pages/about.tsx)

Menggunakan `PublicLayout`. Desain unik dengan tema visual Singgah (gradien hijau, teal, batik pattern). Sections:

| #   | Section              | Deskripsi                                                                          |
| --- | -------------------- | ---------------------------------------------------------------------------------- |
| 1   | **Hero**             | Headline besar, sub-headline, badge "Platform Desa Wisata #1"                      |
| 2   | **Angka Berbicara**  | Stats strip: desa, provinsi, pengunjung (dengan animasi counter sederhana)         |
| 3   | **Misi & Visi**      | 3 "value cards" dengan ikon, judul, dan keterangan — background hijau muda         |
| 4   | **Cara Kerja**       | Timeline horizontal/vertikal 4 langkah: Temukan → Jelajahi → Rencanakan → Kunjungi |
| 5   | **Tentang Platform** | Narasi singkat latar belakang & motivasi pembuatan Singgah (dari APP_SPEC_BACKUP)  |
| 6   | **FAQ**              | Accordion expandable, 8 pertanyaan umum (untuk pengunjung & pengelola)             |
| 7   | **Kontak Kami**      | Card kontak: email, Instagram, YouTube + CTA daftar desa                           |

---

### 3. Halaman Kebijakan Privasi

#### [NEW] [privacy.tsx](file:///d:/Code/singgah/resources/js/pages/privacy.tsx)

Desain dokumen profesional dengan layout 2-kolom di desktop:

- **Kiri**: Sticky Table of Contents (TOC) dengan smooth scroll ke section
- **Kanan**: Konten artikel dengan heading hierarki jelas

Sections dokumen:

1. Pengantar & Tanggal Berlaku
2. Informasi yang Kami Kumpulkan
3. Cara Kami Menggunakan Informasi
4. Berbagi & Pengungkapan Data
5. Keamanan Data
6. Hak-Hak Anda
7. **Ketentuan Khusus: Pengelola Desa** _(badge "Pengelola")_
8. Cookie & Teknologi Pelacak
9. Perubahan Kebijakan Privasi
10. Hubungi Kami

> **Pembedaan Role**: Section 7 secara eksplisit ditandai dengan badge visual khusus dan berisi ketentuan tambahan yang berlaku untuk Pengelola Desa (data yang dikelola, tanggung jawab konten, dll).

---

### 4. Halaman Syarat & Ketentuan

#### [NEW] [terms.tsx](file:///d:/Code/singgah/resources/js/pages/terms.tsx)

Sama dengan privacy: layout 2-kolom sticky TOC + konten.

Sections dokumen:

1. Pengantar & Penerimaan Ketentuan
2. Definisi
3. Penggunaan Platform
4. **Hak & Kewajiban Pengunjung** _(badge "Pengunjung")_
5. **Hak & Kewajiban Pengelola Desa** _(badge "Pengelola")_
6. Konten & Moderasi
7. Kekayaan Intelektual
8. Pembatasan Tanggung Jawab
9. Penghentian & Penonaktifan Akun
10. Perubahan Ketentuan
11. Hukum yang Berlaku (Hukum Indonesia)

> **Pembedaan Role**: Section 4 & 5 masing-masing memiliki badge visual berwarna berbeda (biru untuk Pengunjung, hijau untuk Pengelola) untuk memudahkan navigasi visual.

---

### 5. CSS Tambahan

#### [MODIFY] [app.css](file:///d:/Code/singgah/resources/css/app.css)

Tambah utility class baru:

- `.legal-section` — padding + border-bottom untuk tiap section dokumen legal
- `.legal-h2` — heading section dokumen dengan border-left aksen hijau
- `.role-badge-visitor` — badge biru "Pengunjung"
- `.role-badge-manager` — badge hijau "Pengelola Desa"
- `.toc-link` — link TOC sidebar dengan hover effect
- `.faq-item` — accordion item untuk FAQ

---

### 6. Update APP_SPEC

Tambah section **`## 10. HALAMAN STATIS PUBLIK`** ke `APP_SPEC .md`.

---

## Rencana Verifikasi

### Browser Check

- Desktop (1280px): pastikan sticky TOC berfungsi, layout 2-kolom proporsional
- Tablet (768px): TOC collapse, konten full width
- Mobile (375px): semua section terbaca, FAQ accordion berfungsi

### Tidak Ada Backend Test

Semua halaman adalah frontend-only (render statis tanpa query database).
