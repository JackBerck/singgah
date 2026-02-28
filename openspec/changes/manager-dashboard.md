# Proposal: Dashboard Pengelola Desa (Singgah)

## Konteks

Pengelola Desa adalah role khusus di Singgah yang memiliki tanggung jawab mengelola semua konten terkait desa wisata milik mereka (1 akun = 1 desa). Fitur ini mencakup 6 modul utama dalam dashboard yang terpisah dari dashboard admin/super-admin.

---

## Arsitektur & Keputusan Teknikal

### Backend

- **Routing**: Route group `/manager/*` dilindungi middleware `auth` + `EnsureVillageManager` (cek role dari field `role` di tabel `users`, atau cek relasi village.manager_id)
- **Controller namespace**: `App\Http\Controllers\Manager\`
- **Form Requests**: 1 Form Request per operasi (StoreEventRequest, UpdateEventRequest, dll) — semua divalidasi di server
- **Authorization**: Policy per model — Pengelola hanya bisa akses resource milik desanya sendiri
- **Response**: Semua write operation redirect dengan `session()->flash('success'/'error', ...)` yang di-consume oleh Sonner toast di FE
- **Rich Editor**: Deskripsi panjang disimpan sebagai HTML (kolom `description` = `longText` di DB)

### Frontend

- **Layout**: `ManagerLayout.tsx` — terpisah dari `AppLayout` (admin) dan `PublicLayout` (publik)
- **Sidebar**: Collapsible di mobile (drawer), sticky di desktop
- **Toast/Feedback**: Menggunakan komponen `Toaster` dari `sooner.tsx` yang sudah ada — trigger via Inertia flash props
- **Rich Editor**: Tiptap (sudah banyak digunakan di ekosistem Shadcn)
- **Media Upload**: Upload sequensial via Inertia form, tampilan grid drag-and-drop di FE

---

## Halaman & Fitur

### Navigasi Sidebar

```
🏠 Dashboard
── Desa Saya ──────────────
  📍 Profil Desa
── Konten ─────────────────
  🗓️ Acara
  🏛️ Wisata / Atraksi
  🍜 Kuliner & UMKM
  🏨 Akomodasi
── Komunitas ──────────────
  ⭐ Ulasan Masuk
── Akun ───────────────────
  ⚙️  Pengaturan
  ← Keluar
```

### 1. Dashboard Overview (`/manager`)

**Stats Cards** (top):

- Total Pengunjung (placeholder; bisa dikembangkan dengan view_count)
- Total Konten (events + attractions + culinaries + accommodations)
- Rata-rata Rating Desa (dari reviews)
- Status Verifikasi Desa (badge: Terverifikasi / Pending / Ditolak)

**Konten Terbaru** — tabel dengan 5 baris teratas dari setiap modul

### 2. Profil Desa (`/manager/village/edit`)

Form edit profil desa (hanya 1 desa per pengelola):

- Nama, Slug (auto-gen), Deskripsi Singkat, **Deskripsi Lengkap (Tiptap Rich Editor)**
- Alamat, Map URL, Latitude/Longitude (input biasa)
- **Media Uploader**: upload gambar drag-and-drop, reorder, hapus
- Status verifikasi (read-only dengan badge visual)

### 3. Acara Desa (`/manager/events/*`)

- **Index**: Tabel dengan kolom Nama, Tanggal Event, Status (Upcoming/Past/Featured), Aksi
- **Create/Edit**: Form dengan datepicker (event_date, end_date), rich editor description, contact_info, location, is_featured toggle, media uploader

### 4. Wisata / Atraksi (`/manager/attractions/*`)

- **Index**: Tabel Nama, Harga, Jam Operasional, Aksi
- **Create/Edit**: name, description (rich), price_min/max (currency input), location, contact_info, operating_hours, media

### 5. Kuliner & UMKM (`/manager/culinaries/*`)

- **Index**: Tabel Nama, Kisaran Harga, Lokasi, Aksi
- **Create/Edit**: name, description (rich), price_min/max, location, contact_info, media

### 6. Akomodasi (`/manager/accommodations/*`)

- **Index**: Tabel Nama, Harga/malam, Jam, Aksi
- **Create/Edit**: name, description (rich), price_min/max, location, contact_info, operating_hours, media

### 7. Ulasan Masuk (`/manager/reviews`) _(Bonus — Read Only)_

- Daftar ulasan pengunjung untuk desa ini
- Tampilkan rating, nama pengunjung, tanggal, dan isi ulasan
- Tidak ada aksi hapus/edit (moderasi oleh admin)

---

## Fitur Tambahan yang Disarankan

| Fitur                                                       | Alasan                                                       |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| **Preview Profil Publik** (link eksternal ke `/desa/:slug`) | Pengelola bisa melihat tampilannya di publik                 |
| **Notifikasi Dashboard**                                    | Jika desa di-reject, tampilkan alasan rejection dengan jelas |
| **Quick Stats Konten**                                      | Counter per modul di sidebar                                 |
| **Panduan Pengisian**                                       | Tooltip/info kecil di setiap field penting                   |

---

## File yang Akan Dibuat/Dimodifikasi

### Backend

| File                                                       | Status                                                          |
| ---------------------------------------------------------- | --------------------------------------------------------------- |
| `app/Http/Middleware/EnsureVillageManager.php`             | NEW                                                             |
| `app/Http/Controllers/Manager/DashboardController.php`     | NEW                                                             |
| `app/Http/Controllers/Manager/VillageController.php`       | NEW                                                             |
| `app/Http/Controllers/Manager/VillageMediaController.php`  | NEW                                                             |
| `app/Http/Controllers/Manager/EventController.php`         | NEW                                                             |
| `app/Http/Controllers/Manager/AttractionController.php`    | NEW                                                             |
| `app/Http/Controllers/Manager/CulinaryController.php`      | NEW                                                             |
| `app/Http/Controllers/Manager/AccommodationController.php` | NEW                                                             |
| `app/Http/Controllers/Manager/ReviewController.php`        | NEW                                                             |
| `app/Http/Requests/Manager/UpdateVillageRequest.php`       | NEW                                                             |
| `app/Http/Requests/Manager/StoreEventRequest.php`          | NEW                                                             |
| `app/Http/Requests/Manager/UpdateEventRequest.php`         | NEW                                                             |
| `app/Http/Requests/Manager/StoreAttractionRequest.php`     | NEW                                                             |
| `app/Http/Requests/Manager/UpdateAttractionRequest.php`    | NEW                                                             |
| `app/Http/Requests/Manager/StoreCulinaryRequest.php`       | NEW                                                             |
| `app/Http/Requests/Manager/UpdateCulinaryRequest.php`      | NEW                                                             |
| `app/Http/Requests/Manager/StoreAccommodationRequest.php`  | NEW                                                             |
| `app/Http/Requests/Manager/UpdateAccommodationRequest.php` | NEW                                                             |
| `app/Policies/VillagePolicy.php`                           | NEW                                                             |
| `app/Policies/ContentPolicy.php`                           | NEW (shared untuk Events/Attractions/Culinaries/Accommodations) |
| `routes/web.php`                                           | MODIFY                                                          |

### Frontend

| File                                                   | Status                               |
| ------------------------------------------------------ | ------------------------------------ |
| `resources/js/layouts/ManagerLayout.tsx`               | NEW                                  |
| `resources/js/components/manager/Sidebar.tsx`          | NEW                                  |
| `resources/js/components/manager/StatCard.tsx`         | NEW                                  |
| `resources/js/components/manager/PageHeader.tsx`       | NEW                                  |
| `resources/js/components/manager/DataTable.tsx`        | NEW                                  |
| `resources/js/components/manager/MediaUploader.tsx`    | NEW                                  |
| `resources/js/components/manager/RichEditor.tsx`       | NEW                                  |
| `resources/js/pages/manager/dashboard.tsx`             | NEW                                  |
| `resources/js/pages/manager/village/edit.tsx`          | NEW                                  |
| `resources/js/pages/manager/events/index.tsx`          | NEW                                  |
| `resources/js/pages/manager/events/create.tsx`         | NEW                                  |
| `resources/js/pages/manager/events/edit.tsx`           | NEW                                  |
| `resources/js/pages/manager/attractions/index.tsx`     | NEW                                  |
| `resources/js/pages/manager/attractions/create.tsx`    | NEW                                  |
| `resources/js/pages/manager/attractions/edit.tsx`      | NEW                                  |
| `resources/js/pages/manager/culinaries/index.tsx`      | NEW                                  |
| `resources/js/pages/manager/culinaries/create.tsx`     | NEW                                  |
| `resources/js/pages/manager/culinaries/edit.tsx`       | NEW                                  |
| `resources/js/pages/manager/accommodations/index.tsx`  | NEW                                  |
| `resources/js/pages/manager/accommodations/create.tsx` | NEW                                  |
| `resources/js/pages/manager/accommodations/edit.tsx`   | NEW                                  |
| `resources/js/pages/manager/reviews/index.tsx`         | NEW                                  |
| `resources/css/app.css`                                | MODIFY (tambah `.manager-*` utility) |
| `APP_SPEC .md`                                         | MODIFY                               |

---

## Catatan Penting

> [!IMPORTANT]
> Field `role` ada di tabel `users` namun tidak terlihat di migration yang ada. Jika belum ada, perlu dicek apakah Fortify/settingsnya sudah memasukkan role. Middleware `EnsureVillageManager` akan mengecek kondisi ini.

> [!NOTE]
> Rich text editor Tiptap perlu di-install via `npm install @tiptap/react @tiptap/starter-kit`. Ini akan ditambahkan dalam tahap eksekusi.
