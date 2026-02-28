# Proposal: Redesain Halaman Autentikasi (Auth Pages)

## 1. Latar Belakang

Halaman autentikasi saat ini menggunakan layout generic (teks sederhana + form di tengah layar) tanpa identitas visual yang selaras dengan brand **Singgah**. Halaman beranda sudah memiliki desain unik dan kuat menggunakan design system Singgah (hijau, teal, earth, batik SVG pattern, dll). Halaman autentikasi perlu direkontruksi agar konsisten secara visual, memberikan kesan pertama yang kuat, dan memudahkan pengguna mengingat platform.

## 2. Tujuan

- Mengintegrasikan brand identity Singgah ke seluruh halaman autentikasi.
- Membuat layout yang unik (split-panel dengan ilustrasi/branding di sisi kiri) namun tetap sederhana dan mudah digunakan.
- Melokalisasi semua teks ke Bahasa Indonesia.
- Memastikan semua halaman auth responsif (mobile-first).
- Menjaga konsistensi penuh dengan halaman beranda yang sudah ada.

## 3. Halaman yang Terdampak

| File                                  | Rute                     | Status   |
| ------------------------------------- | ------------------------ | -------- |
| `pages/auth/login.tsx`                | `/login`                 | Redesain |
| `pages/auth/register.tsx`             | `/register`              | Redesain |
| `pages/auth/forgot-password.tsx`      | `/forgot-password`       | Redesain |
| `pages/auth/confirm-password.tsx`     | `/user/confirm-password` | Redesain |
| `pages/auth/reset-password.tsx`       | `/reset-password`        | Redesain |
| `pages/auth/verify-email.tsx`         | `/email/verify`          | Redesain |
| `pages/auth/two-factor-challenge.tsx` | `/two-factor-challenge`  | Redesain |
| `layouts/auth/auth-simple-layout.tsx` | _(shared layout)_        | Redesain |

## 4. Desain Konsep: Split-Panel Auth Layout

### Layout Utama (Desktop/Tablet)

```
┌─────────────────────────────┬─────────────────────────────┐
│                             │                             │
│   PANEL KIRI (Branding)     │   PANEL KANAN (Form)        │
│                             │                             │
│  hero-gradient background   │  Putih bersih               │
│  + batik SVG pattern        │                             │
│                             │  Logo + App Name            │
│  Logo besar                 │  Judul halaman              │
│  Tagline Singgah            │  Deskripsi singkat          │
│  Ikon/ilustrasi desa wisata │                             │
│  Quote atau statistik       │  [FORM FIELDS]              │
│                             │                             │
│                             │  Submit Button (green)      │
│                             │  Link sekunder              │
│                             │                             │
│                             │  Link kembali ke Beranda    │
└─────────────────────────────┴─────────────────────────────┘
```

### Layout Mobile

Pada layar kecil (< md), panel kiri digantikan dengan **header strip** berupa banner tipis dengan logo, nama app, dan tagline — lalu langsung menampilkan form di bawahnya (full width, background putih).

### Identitas Visual

- **Background panel kiri**: `.hero-gradient` + batik SVG pattern (sama seperti hero homepage)
- **Aksen warna**: `--singgah-green-600`, `--singgah-teal-400`, `--singgah-earth-400`
- **Typography**: Plus Jakarta Sans (`--font-jakarta`)
- **Input style**: Rounded corners, `ring` dengan warna green saat fokus
- **Submit button**: `.btn-primary` (hijau, rounded-full) agar konsisten dengan homepage
- **Dekorasi**: Glowing blobs, floating leaf icons (Lucide `Leaf`, `Trees`) sebagai aksen ringan

## 5. Perubahan per File

### `resources/css/app.css`

Penambahan utility class baru untuk komponen auth:

- `.auth-panel-left` — panel kiri (gradient + pattern)
- `.auth-panel-right` — panel kanan (form wrapper)
- `.auth-input` — input style dengan fokus ring hijau
- `.auth-submit` — alias untuk `.btn-primary` versi full-width

### `resources/js/layouts/auth/auth-simple-layout.tsx`

Rekonstruksi total menjadi **`SinggahAuthLayout`**:

- Split-panel `grid grid-cols-1 md:grid-cols-2` full screen
- Panel kiri: branding, tagline, statistik kecil
- Panel kanan: logo kecil, judul, deskripsi, `{children}`
- Mobile: hanya panel kanan dengan header strip tipis di atas

### `resources/js/layouts/auth-layout.tsx`

Tidak ada perubahan struktural. Tetap mengimport `auth-simple-layout`.

### Halaman Auth

Semua halaman akan:

1. Menggunakan `AuthLayout` yang sudah diperbarui (otomatis dapat desain baru)
2. Memperbarui prop `title` dan `description` ke **Bahasa Indonesia**
3. Memperbarui label, placeholder, teks tombol, dan link teks ke **Bahasa Indonesia**

#### Teks Baru per Halaman

| Halaman          | `title`                 | `description`                                         | Tombol               |
| ---------------- | ----------------------- | ----------------------------------------------------- | -------------------- |
| Login            | `Masuk ke Akun Anda`    | `Masukkan email dan kata sandi Anda`                  | `Masuk`              |
| Register         | `Buat Akun Baru`        | `Daftarkan diri Anda untuk mulai menjelajahi`         | `Daftar Sekarang`    |
| Forgot Password  | `Lupa Kata Sandi?`      | `Masukkan email Anda untuk menerima tautan reset`     | `Kirim Tautan Reset` |
| Confirm Password | `Konfirmasi Kata Sandi` | `Konfirmasi kata sandi Anda sebelum melanjutkan`      | `Konfirmasi`         |
| Reset Password   | `Buat Kata Sandi Baru`  | `Masukkan kata sandi baru Anda di bawah ini`          | `Simpan Kata Sandi`  |
| Verify Email     | `Verifikasi Email Anda` | `Kami telah mengirim tautan verifikasi ke email Anda` | `Kirim Ulang Email`  |
| 2FA Challenge    | `Kode Autentikasi`      | `Masukkan kode dari aplikasi autentikator Anda`       | `Lanjutkan`          |

## 6. Dampak pada APP_SPEC

Penambahan section baru **`## 9. HALAMAN AUTENTIKASI`** ke `APP_SPEC .md`:

```markdown
## 9. HALAMAN AUTENTIKASI

Route: Laravel Fortify (via `/login`, `/register`, `/forgot-password`, dll.)

### Layout

- **`SinggahAuthLayout`** — Layout split-panel dua kolom untuk semua halaman auth.
    - Panel kiri: hero-gradient + batik pattern, logo besar, tagline, ikon desa.
    - Panel kanan: form, judul, deskripsi.
    - Mobile: header strip + form penuh.

### Halaman

- **Login** (`/login`) — Form masuk dengan email & kata sandi, opsi "Ingat Saya", link lupa kata sandi.
- **Register** (`/register`) — Form daftar dengan nama, email, kata sandi, konfirmasi kata sandi.
- **Lupa Kata Sandi** (`/forgot-password`) — Input email untuk menerima tautan reset.
- **Reset Kata Sandi** (`/reset-password`) — Form kata sandi baru (email read-only, password, konfirmasi).
- **Verifikasi Email** (`/email/verify`) — Kirim ulang tautan verifikasi, tombol logout.
- **Konfirmasi Kata Sandi** (`/user/confirm-password`) — Re-autentikasi di area sensitif.
- **Tantangan 2FA** (`/two-factor-challenge`) — Input kode OTP atau kode pemulihan.

### Bahasa

Semua teks UI (label, placeholder, teks tombol, pesan status) menggunakan **Bahasa Indonesia**.

### Desain

- Konsisten dengan design system Singgah (CSS variables, typography, color palette).
- Menggunakan `.btn-primary` untuk tombol submit utama.
- Input fokus menggunakan ring warna `--singgah-green-600`.
```

## 7. Catatan Teknis

- Tidak ada perubahan pada route, controller, atau logic PHP backend.
- Tidak ada perubahan pada Form Request atau validasi backend.
- Semua perubahan bersifat **frontend-only** (React/TSX + CSS).
- Komponen Shadcn UI (`Input`, `Button`, `Label`, `Checkbox`) tetap digunakan.
- `AppLogoIcon` tetap digunakan, namun tampilan dibesarkan di panel kiri.
