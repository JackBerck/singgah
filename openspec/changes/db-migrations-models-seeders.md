# [PROPOSAL] Database Migrations, Models & Seeders

## Summary

Implementasi skema database lengkap untuk platform Singgah berdasarkan APP_SPEC. Mencakup migrations, Eloquent models dengan relasi, factories, dan seeders realistis.

## Feature Context

Sebelum backend/frontend bisa diimplementasikan, skema database harus ada terlebih dahulu. Proposal ini mendefinisikan seluruh tabel, relasi, dan data awal (seed) untuk aplikasi Singgah.

## Schema Design

### Users (modified)

```sql
users
  id              bigint PK
  name            string
  email           string unique
  email_verified_at datetime nullable
  password        string hashed
  avatar          string nullable        -- foto profil pengguna
  phone           string nullable        -- nomor telepon
  address         text nullable          -- alamat
  role            enum(admin,manager,user) default:'user'
  remember_token  string nullable
  two_factor_*    (existing Fortify columns)
  timestamps
```

### Villages (new)

```sql
villages
  id               bigint PK
  manager_id       FK → users.id
  name             string
  slug             string unique         -- untuk URL SEO-friendly
  short_description string nullable      -- deskripsi singkat untuk card
  description      text                  -- deskripsi lengkap
  address          string nullable
  latitude         decimal(10,8) nullable -- koordinat peta presisi
  longitude        decimal(11,8) nullable
  map_url          string nullable        -- embed URL Google Maps
  status           enum(pending,verified,rejected) default:'pending'
  is_featured      boolean default:false  -- untuk highlight di homepage
  rejected_reason  text nullable
  timestamps
```

### Village Events (new)

```sql
village_events
  id           bigint PK
  village_id   FK → villages.id
  name         string
  slug         string
  description  longText                  -- rich text
  location     string nullable           -- lokasi spesifik event
  event_date   datetime
  end_date     datetime nullable
  contact_info string nullable
  is_featured  boolean default:false
  timestamps
```

### Attractions (new)

```sql
attractions
  id              bigint PK
  village_id      FK → villages.id
  name            string
  slug            string
  description     longText               -- rich text
  price_min       decimal(12,2) nullable
  price_max       decimal(12,2) nullable
  location        string nullable        -- lokasi di dalam desa
  contact_info    string nullable
  operating_hours string nullable        -- contoh: "08.00 - 17.00"
  timestamps
```

### Culinaries (new) — menggantikan culinary_umkm dari spec

```sql
culinaries
  id           bigint PK
  village_id   FK → villages.id
  name         string
  slug         string
  description  longText                  -- rich text
  price_min    decimal(12,2) nullable
  price_max    decimal(12,2) nullable
  location     string nullable
  contact_info string nullable
  timestamps
```

### Accommodations (new)

```sql
accommodations
  id              bigint PK
  village_id      FK → villages.id
  name            string
  slug            string
  description     longText               -- rich text
  price_min       decimal(12,2) nullable
  price_max       decimal(12,2) nullable
  location        string nullable
  contact_info    string nullable
  operating_hours string nullable
  timestamps
```

### Reviews (new — polymorphic)

```sql
reviews
  id              bigint PK
  user_id         FK → users.id
  reviewable_id   bigint                 -- polymorphic target id
  reviewable_type string                 -- polymorphic target class
  rating          tinyint (1-5)          -- bintang rating
  comment         text nullable
  is_visible      boolean default:true   -- untuk moderasi admin
  timestamps

  INDEX(reviewable_id, reviewable_type)
```

Reviewable targets: `Village`, `Attraction`, `Culinary`, `Accommodation`

### Media (new — polymorphic)

```sql
media
  id            bigint PK
  mediable_id   bigint                   -- polymorphic target id
  mediable_type string                   -- polymorphic target class
  file_path     string                   -- path di storage/disk
  disk          string default:'public'
  type          enum(image,video)
  alt_text      string nullable          -- aksesibilitas
  order         integer default:0        -- urutan tampil
  timestamps

  INDEX(mediable_id, mediable_type)
```

Mediable targets: `Village`, `VillageEvent`, `Attraction`, `Culinary`, `Accommodation`

## Schema Adjustment Notes (dari APP_SPEC)

| Item                               | App Spec            | Adjustment                                  | Alasan                        |
| ---------------------------------- | ------------------- | ------------------------------------------- | ----------------------------- |
| Nama tabel kuliner                 | `culinary_umkm`     | `culinaries`                                | Laravel naming convention     |
| Slug                               | Tidak ada           | Ditambahkan ke semua entity                 | SEO & URL routing             |
| Latitude/longitude                 | Hanya `map_url`     | Tambah lat/lng                              | Presisi peta interaktif       |
| `short_description`                | Tidak ada           | Ditambahkan ke villages                     | Preview di listing/card       |
| `location` string                  | Tidak ada di entity | Ditambahkan                                 | Info krusial untuk wisatawan  |
| `operating_hours`                  | Tidak ada           | Ditambahkan ke attractions & accommodations | Info operasional              |
| `is_featured`                      | Tidak ada           | Ditambahkan ke villages & events            | Bootstrap homepage content    |
| `is_visible` di reviews            | Tidak ada           | Ditambahkan                                 | Kebutuhan moderasi admin      |
| Media: `alt_text`, `order`, `disk` | Tidak ada           | Ditambahkan                                 | Aksesibilitas & multi-storage |

## Seeder Data Plan

### Users

- 1 super admin (admin@singgah.id / password)
- 5–7 village managers (manager1@singgah.id ... / password)
- 10–15 regular visitors (visitor berbeda) / password)

### Villages (5 desa wisata realistis Indonesia)

1. Desa Penglipuran — Bali (verified, featured)
2. Desa Sade — Lombok, NTB (verified)
3. Desa Wae Rebo — Manggarai, NTT (verified)
4. Desa Dieng — Wonosobo, Jawa Tengah (verified)
5. Desa Trunyan — Kintamani, Bali (verified)
6. Desa Kemiren — Banyuwangi, Jawa Timur (pending — dummy untuk demo flow verifikasi)

### Entities per Village

- 3–5 Atraksi (wisata alam, budaya, aktifitas)
- 4–6 Kuliner/UMKM (makanan khas, kerajinan tangan)
- 2–4 Akomodasi (homestay, vila, penginapan)
- 2–3 Event (festival, upacara adat, panen)

### Reviews

- 5–10 ulasan per village, 3–5 per attraction/culinary/accommodation
- Rating realistis (campuran bintang 3–5)

### Media

- Dummy file path format: `images/{entity_type}/{entity_id}/{index}.jpg`
- 3–5 gambar per village
- 1–3 gambar per entity (atraksi, kuliner, akomodasi)
- 1 gambar per event (opsional)

## Implementation Files

### Migrations

- `{timestamp}_modify_users_table_add_profile_fields.php`
- `{timestamp}_create_villages_table.php`
- `{timestamp}_create_village_events_table.php`
- `{timestamp}_create_attractions_table.php`
- `{timestamp}_create_culinaries_table.php`
- `{timestamp}_create_accommodations_table.php`
- `{timestamp}_create_reviews_table.php`
- `{timestamp}_create_media_table.php`

### Models

- `app/Models/User.php` (modified)
- `app/Models/Village.php` (new)
- `app/Models/VillageEvent.php` (new)
- `app/Models/Attraction.php` (new)
- `app/Models/Culinary.php` (new)
- `app/Models/Accommodation.php` (new)
- `app/Models/Review.php` (new)
- `app/Models/Media.php` (new)

### Factories

- `database/factories/UserFactory.php` (modified)
- `database/factories/VillageFactory.php` (new)
- `database/factories/VillageEventFactory.php` (new)
- `database/factories/AttractionFactory.php` (new)
- `database/factories/CulinaryFactory.php` (new)
- `database/factories/AccommodationFactory.php` (new)
- `database/factories/ReviewFactory.php` (new)
- `database/factories/MediaFactory.php` (new)

### Seeders

- `database/seeders/AdminSeeder.php` (new)
- `database/seeders/VillageSeeder.php` (new)
- `database/seeders/EntitySeeder.php` (new)
- `database/seeders/EventSeeder.php` (new)
- `database/seeders/ReviewSeeder.php` (new)
- `database/seeders/MediaSeeder.php` (new)
- `database/seeders/DatabaseSeeder.php` (modified)
