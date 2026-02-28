# PROJECT SPECIFICATION: SINGGAH

## 1. GENERAL INFORMATION

- **App Name:** Singgah
- **Slogan:** Jelajahi Keindahan Desa
- **Description:** A web-based platform designed to promote Indonesian tourism villages (Desa Wisata) and local creative economies (UMKM). It serves as a centralized hub for tourists to explore attractions, accommodations, and culinary spots, while empowering village managers to maintain their digital presence independently.
- **Core Value:** Emphasizes local creative economy, AI-driven personalization for trip planning, and independent data management by village communities.

## 2. TECH STACK

- **Backend:** Laravel 12
- **Frontend:** React (integrated via Laravel Starter Kit / Inertia), TailwindCSS, Shadcn UI
- **Database:** PostgreSQL
- **AI Integration:** To be determined (for AI Travel Assistant)

## 3. USER ROLES & FEATURES

### A. Visitor (Pengunjung)

- **Explore Village Profile:** View general description, media gallery, interactive map (Google Maps), and upcoming events.
- **Explore Entities:** View detailed information (rich text description, pricing, media, contacts) for:
    - Attractions (Wisata)
    - Local Culinary/UMKM
    - Accommodations
- **Community Interaction:** Leave ratings and comments on villages/entities.
- **AI Travel Assistant:** Chatbot interface to get personalized destination recommendations based on user preferences.

### B. Village Manager (Pengelola Desa)

- **Village CMS Dashboard:** Manage (CRUD) village profile, attractions, UMKM, accommodations, and events.

### C. Super Admin

- **Admin Dashboard:** \* Verify and approve village manager registrations and village listings.
    - Manage users.
    - Moderate content (reviews, village information).

## 4. DATABASE SCHEMA DESIGN (NORMALIZED GUIDELINES)

_Agent Directive: Ensure optimal relationships, indexing, and data types for PostgreSQL._

- **Users Table:** Standard Laravel Auth + `avatar` (string/nullable), `phone` (string/nullable), `address` (text/nullable), `role` (enum: admin, manager, user).
- **Villages Table:** `id`, `manager_id` (FK to Users), `name`, `description` (text), `map_url` (string), `status` (enum: pending, verified, rejected).
- **Village_Events Table:** `id`, `village_id` (FK), `name`, `description` (rich text), `event_date` (datetime), `contact_info` (string).
- **Attractions Table:** `id`, `village_id` (FK), `name`, `description` (rich text), `price_min` (decimal), `price_max` (decimal), `contact_info` (string).
- **Culinary_UMKM Table:** `id`, `village_id` (FK), `name`, `description` (rich text), `price_min` (decimal), `price_max` (decimal), `contact_info` (string).
- **Accommodations Table:** `id`, `village_id` (FK), `name`, `description` (rich text), `price_min` (decimal), `price_max` (decimal), `contact_info` (string).
- **Reviews Table:** `id`, `user_id` (FK), `reviewable_id`, `reviewable_type` (Polymorphic relation to allow reviews on Villages, Attractions, or Accommodations), `rating` (integer 1-5), `comment` (text).
- **Media Table (Polymorphic):** `id`, `mediable_id`, `mediable_type`, `file_path`, `type` (image/video). _Directive: Enforce max limits and file size validation at the application level._

## 5. BACKEND ARCHITECTURE & CODING STANDARDS

_Agent Directive: Strictly adhere to the following architectural patterns when generating Laravel code._

1. **Validation & Localization:** All incoming requests must be validated. Validation feedback messages must be in Indonesian.
2. **Skinny Controllers:** Controllers must only handle HTTP request and response routing. No complex business logic or queries inside controllers.
3. **Form Requests:** Use Custom Form Request classes for validation instead of `$request->validate()` in controllers.
4. **Action Pattern:** Extract business logic into Action classes (e.g., `CreateVillageAction`, `UploadMediaAction`).
5. **Data Transfer Objects (DTO):** Use DTOs to ensure type safety and standardize data structures passed into business logic/actions.
6. **Query Management:** Utilize Eloquent Scopes or Custom Query Builders to abstract complex database queries. Avoid N+1 query issues by strictly defining eager loading (`with()`).
7. **Strict File Validation:** Media uploads must have strict MIME type, file size, and quantity limit validations enforced via Form Requests.

## 6. FRONTEND ARCHITECTURE & DESIGN GUIDELINES

_Agent Directive: Strictly adhere to the following frontend structure, styling rules, and UI/UX principles to ensure a highly consistent and accessible user interface._

1. **Standardized Layout Structure:** All pages must follow a uniform layout pattern to maintain consistent margins and padding across the application. Use the following JSX/TSX boilerplate for every new page:

```jsx
<Layout>
    {/* Example: Hero / Header Section */}
    <section className="section-padding-x">
        <div className="container max-w-7xl">{/* Hero Section Content */}</div>
    </section>

    {/* Example: Content / Categories Section */}
    <section className="section-padding-x py-6">
        <div className="container max-w-7xl">
            {/* Categories Section Content */}
        </div>
    </section>
</Layout>
```

2. **Typography:** All font sizes must strictly use the standardized utility classes or variables defined within app.css. Avoid hardcoding custom font-size values inline or in module classes.
3. **Color Palette & CSS Variables:**
    - Theme: Bright, fresh, and inviting. The primary color scheme should focus on Green (representing nature/village) and Blue (representing sky/water/trust).
    - Implementation: All theme colors must be defined as CSS variables within app.css (e.g., --primary-green, --secondary-blue, --bg-light). Do not hardcode HEX or RGB values directly into the React components; always reference these CSS variables (via Tailwind config or direct CSS).
    - UI/UX Consistency: Maintain a strict design system. Buttons, input fields, cards, spacing, and hover effects must be visually consistent across all features and pages.
4. **Accessibility & Simplicity (User-Friendly):** The design must be clean, simple, and intuitive. It should be highly accessible for users of all demographics and ages ("ramah di semua kalangan masyarakat"). Prioritize clear typography, high contrast for text, and straightforward navigation over complex animations or convoluted layouts.

## 7. HALAMAN BERANDA (PUBLIC HOMEPAGE)

_Route: `GET /` → `HomeController@index` → Inertia `home` page_

### Sections:

1. **Hero** — Headline, sub-headline, search bar, 2 CTA buttons, stats strip (jumlah desa, provinsi, pengunjung). Background: green gradient dengan subtle batik SVG pattern.
2. **Kategori Desa** — 6 kategori: Wisata Alam, Budaya & Tradisi, Kuliner Lokal, Agrowisata, Pesisir & Bahari, Desa Kreatif. Klik → `/explore?kategori=...`
3. **Desa Pilihan** — 8 card desa (is_featured=true, status=verified). Data real dari database. Link → `/explore`
4. **Jelajahi per Wilayah** — 8 kartu kota/wilayah besar Indonesia (Bali, Yogyakarta, Lombok, Jawa Barat, Danau Toba, Toraja, Flores, Kalimantan Timur). Klik → `/explore?wilayah=...`
5. **Desa Terbaru** — 8 card desa terbaru (status=verified, sort by created_at desc). Link → `/explore?sort=terbaru`
6. **CTA Banner** — Ajakan mendaftarkan desa ke platform (link ke `/register`).

### Data Props (dari HomeController):

- `featuredVillages` — max 8, query: `verified()->featured()->withCount('reviews')->withAvg('reviews', 'rating')`
- `newVillages` — max 8, query: `verified()->latest()->withCount('reviews')->withAvg('reviews', 'rating')`
- `stats` — `{ villages_count, provinces_count, visitors_count }`

## 8. KOMPONEN PUBLIK BERSAMA

### Layout

- **`PublicLayout`** (`resources/js/layouts/PublicLayout.tsx`) — Wrapper Navbar + main + Footer untuk semua halaman publik.

### Shared Components (`resources/js/components/public/`)

- **`Navbar`** — Transparan saat di atas hero, solid (white/blur) saat di-scroll. Mobile hamburger drawer. Auth-aware (tampilkan tombol Masuk/Daftar atau Dashboard).
- **`Footer`** — 4 kolom: brand, navigasi, kategori, pengelola. Social links. Copyright. Wave SVG divider di atas.
- **`VillageCard`** — Inlined di `home.tsx`, reusable card untuk tampilan desa (gambar, nama, lokasi, rating, link ke `/desa/:slug`).

### Design System (`resources/css/app.css`)

- `--singgah-green-*` — Hijau alam (primary)
- `--singgah-teal-*` — Teal air/langit (secondary)
- `--singgah-earth-*` — Earthy/krem (accent)
- `--singgah-sky-*` — Biru langit
- Utility classes: `.hero-gradient`, `.section-label`, `.section-title`, `.village-card`, `.region-card`, `.category-card`, `.btn-primary`, `.btn-outline-white`
- Auth utility classes: `.auth-layout-root`, `.auth-panel-left`, `.auth-panel-right`

## 9. HALAMAN AUTENTIKASI

_Route: Laravel Fortify (`/login`, `/register`, `/forgot-password`, dll.)_

### Layout

- **`SinggahAuthLayout`** (`resources/js/layouts/auth/auth-simple-layout.tsx`) — Layout split-panel dua kolom untuk semua halaman auth.
    - **Panel Kiri** (desktop only, `md:flex`): `hero-gradient` + batik SVG pattern (sama dengan hero beranda), logo Singgah besar, tagline, statistik platform, quote inspiratif.
    - **Panel Kanan**: Wrapper putih bersih dengan logo kecil, judul (`title` prop), deskripsi (`description` prop), dan slot `{children}` untuk form.
    - **Mobile** (`< md`): Panel kiri disembunyikan, diganti header strip tipis bergradien hijau di atas form.

### Halaman

| Halaman               | Route                    | Judul (ID)                        |
| --------------------- | ------------------------ | --------------------------------- |
| Login                 | `/login`                 | Masuk ke Akun Anda                |
| Register              | `/register`              | Buat Akun Baru                    |
| Lupa Kata Sandi       | `/forgot-password`       | Lupa Kata Sandi?                  |
| Konfirmasi Kata Sandi | `/user/confirm-password` | Konfirmasi Kata Sandi             |
| Reset Kata Sandi      | `/reset-password`        | Buat Kata Sandi Baru              |
| Verifikasi Email      | `/email/verify`          | Verifikasi Email Anda             |
| Verifikasi 2FA        | `/two-factor-challenge`  | Kode Autentikasi / Kode Pemulihan |

### Bahasa & Desain

- Semua teks UI (label, placeholder, tombol, pesan status) menggunakan **Bahasa Indonesia**.
- Tombol submit menggunakan style `.btn-primary` — hijau rounded-full, konsisten dengan homepage.
- Input fokus menggunakan `ring-[--singgah-green-600]`.
- Tidak ada perubahan backend — semua perubahan bersifat **frontend-only**.

## 10. HALAMAN STATIS PUBLIK

_Routes: GET `/tentang` → `StaticPageController@about`, GET `/privasi` → `privacy`, GET `/syarat` → `terms`_

### Layout

Semua halaman menggunakan `PublicLayout` (Navbar + Footer). Tidak ada query database — halaman sepenuhnya statis/frontend.

### Halaman Tentang Kami (`/tentang`)

7 sections: Hero (gradient + batik), Angka Berbicara (4 stats), Misi & Visi (3 value cards), Cara Kerja (4 steps dengan nomor dekoratif), Tentang Platform (narasi 2-kolom), FAQ (8 pertanyaan accordion tanpa library), Kontak Kami (3 card: email, Instagram, YouTube).

### Halaman Kebijakan Privasi (`/privasi`)

Layout 2-kolom: sticky TOC sidebar (desktop) + collapsible TOC (mobile), konten artikel 10 section.
Section khusus Pengelola Desa ditandai badge `role-badge-manager` (hijau) berisi: tanggung jawab konten, data pengunjung, konten pihak ketiga, dan penghapusan akun.
Active section tracking via `IntersectionObserver`.

### Halaman Syarat & Ketentuan (`/syarat`)

Layout identik dengan Kebijakan Privasi + 11 section.
Pembedaan role yang jelas:

- Badge `role-badge-visitor` (biru) pada section **Hak & Kewajiban Pengunjung**
- Badge `role-badge-manager` (hijau) pada section **Hak & Kewajiban Pengelola Desa**

### CSS Utilities (app.css)

- `.legal-section`, `.legal-h2`, `.legal-h3`, `.legal-p`, `.legal-ul` — document styling
- `.role-badge`, `.role-badge-visitor`, `.role-badge-manager` — role differentiation badges
- `.toc-link` — sidebar TOC links dengan hover/active state
- `.faq-item` — FAQ accordion container
- `.step-card`, `.step-number-bg` — "Cara Kerja" step cards
- `.value-card` — feature/value cards dengan hover lift
