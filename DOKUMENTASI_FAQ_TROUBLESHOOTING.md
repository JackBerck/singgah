# ❓ FAQ & TROUBLESHOOTING

## Frequently Asked Questions dan Panduan Pemecahan Masalah

---

## 📌 FREQUENTLY ASKED QUESTIONS (FAQ)

### A. Pertanyaan Umum

#### Q1: Apa itu Singgah?
**A:** Singgah adalah platform desa wisata Indonesia berbasis web yang menghubungkan wisatawan dengan destinasi lokal dan memberdayakan pengelola desa untuk mengelola profil digital secara mandiri.

#### Q2: Siapa saja yang bisa menggunakan Singgah?
**A:** Ada 3 tipe pengguna:
- **Pengunjung (Guest/User)** - Siapa saja bisa menjelajah desa, membaca review, dan menggunakan AI assistant
- **Pengelola Desa (Manager)** - Pengelola resmi yang mendaftar dan diverifikasi untuk mengelola konten desa
- **Admin** - Administrator platform yang melakukan verifikasi dan moderasi

#### Q3: Apakah gratis untuk mendaftar sebagai pengelola desa?
**A:** Ya, pendaftaran sebagai pengelola desa sepenuhnya gratis. Namun perlu melalui proses verifikasi oleh admin.

#### Q4: Berapa lama proses verifikasi desa?
**A:** Proses verifikasi biasanya memakan waktu 1-3 hari kerja setelah pendaftaran lengkap disubmit.

#### Q5: Apa yang terjadi jika desa saya ditolak?
**A:** Anda akan menerima notifikasi dengan alasan penolakan. Anda bisa memperbaiki data dan mendaftar ulang.

### B. Pertanyaan Teknis

#### Q6: Database apa yang digunakan?
**A:** Sistem direkomendasikan menggunakan PostgreSQL 14+ karena fitur `ILIKE` operator untuk pencarian case-insensitive. Alternatif: MySQL 8+ atau SQLite (development only).

#### Q7: Apakah sistem support multi-bahasa?
**A:** Saat ini sistem hanya support Bahasa Indonesia. Multi-bahasa ada di roadmap Phase 3 (Q3 2026).

#### Q8: Bagaimana cara kerja AI Travel Assistant?
**A:** AI menggunakan pendekatan RAG (Retrieval-Augmented Generation):
1. Ekstraksi keyword dari pertanyaan user
2. Pencarian data relevan dari database
3. Kirim context + pertanyaan ke AI API
4. Return jawaban yang relevan berdasarkan data nyata

#### Q9: Apakah ada limit untuk upload media?
**A:** Ya, ada batasan:
- **Gambar:** Max 5MB per file (jpg, jpeg, png, webp)
- **Video:** Max 50MB per file (mp4, mov, avi)

#### Q10: Bagaimana sistem handle review spam?
**A:** Sistem memiliki beberapa proteksi:
- User harus login untuk review
- Satu user hanya bisa review satu kali per entitas
- Admin bisa hide/delete review yang tidak pantas
- Rate limiting untuk mencegah spam

### C. Pertanyaan Pengembangan

#### Q11: Apakah ada API untuk integrasi eksternal?
**A:** Saat ini sistem menggunakan Inertia.js (bukan REST API tradisional). REST API untuk mobile app ada di roadmap Phase 3.

#### Q12: Bagaimana cara menambah kategori desa baru?
**A:** Edit file `app/Models/Village.php` method `categories()` dan tambahkan kategori baru. Jangan lupa update seeder dan migration jika perlu.

#### Q13: Apakah bisa deploy di shared hosting?
**A:** Tidak direkomendasikan. Sistem membutuhkan:
- PHP 8.2+
- Composer
- Node.js untuk build
- Queue worker (supervisor)
- Cron jobs
Lebih baik gunakan VPS atau cloud hosting (DigitalOcean, AWS, dll).

#### Q14: Bagaimana cara backup data?
**A:** Ada 2 jenis backup:
- **Database:** `pg_dump` untuk PostgreSQL (daily)
- **Files:** `tar` untuk storage/app/public (weekly)
Lihat section Deployment untuk script lengkap.

#### Q15: Apakah support Docker?
**A:** Ya, Laravel Sail sudah included untuk development dengan Docker. Untuk production, bisa setup custom Dockerfile.

---

## 🔧 TROUBLESHOOTING

### 1. Installation Issues

#### Problem: `composer install` gagal
**Symptoms:**
```
Your requirements could not be resolved to an installable set of packages.
```

**Solutions:**
```bash
# Update composer
composer self-update

# Clear cache
composer clear-cache

# Install dengan ignore platform reqs (development only)
composer install --ignore-platform-reqs

# Cek PHP version
php -v  # Harus 8.2+
```

#### Problem: `npm install` error
**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules dan package-lock.json
rm -rf node_modules package-lock.json

# Install ulang
npm install

# Atau gunakan --legacy-peer-deps
npm install --legacy-peer-deps
```

#### Problem: `php artisan key:generate` tidak jalan
**Symptoms:**
```
No application encryption key has been specified.
```

**Solutions:**
```bash
# Pastikan .env ada
cp .env.example .env

# Generate key
php artisan key:generate

# Cek .env
cat .env | grep APP_KEY
```

### 2. Database Issues

#### Problem: Migration gagal
**Symptoms:**
```
SQLSTATE[42S01]: Base table or view already exists
```

**Solutions:**
```bash
# Fresh migration (WARNING: hapus semua data)
php artisan migrate:fresh

# Atau rollback dulu
php artisan migrate:rollback
php artisan migrate

# Cek status migration
php artisan migrate:status
```

#### Problem: ILIKE operator not found (MySQL)
**Symptoms:**
```
SQLSTATE[42000]: Syntax error: ILIKE
```

**Solutions:**
1. **Opsi 1:** Ganti ke PostgreSQL (recommended)
2. **Opsi 2:** Replace semua `ilike` dengan `like` di codebase
```bash
# Find all ilike usage
grep -r "ilike" app/
```

#### Problem: Connection refused
**Symptoms:**
```
SQLSTATE[HY000] [2002] Connection refused
```

**Solutions:**
```bash
# Cek database service running
sudo systemctl status postgresql
# atau
sudo systemctl status mysql

# Start service
sudo systemctl start postgresql

# Cek .env config
DB_HOST=127.0.0.1
DB_PORT=5432  # PostgreSQL
DB_DATABASE=singgah
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

### 3. Storage & Permission Issues

#### Problem: Storage link tidak jalan
**Symptoms:**
```
The [public/storage] link already exists.
```

**Solutions:**
```bash
# Hapus link lama
rm public/storage

# Buat link baru
php artisan storage:link

# Cek permission
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

#### Problem: Upload file gagal
**Symptoms:**
```
The file could not be uploaded.
```

**Solutions:**
```bash
# Cek permission folder storage
ls -la storage/app/public

# Set permission
chmod -R 775 storage/app/public

# Cek PHP upload limits di php.ini
upload_max_filesize = 50M
post_max_size = 50M
max_execution_time = 300

# Restart PHP-FPM
sudo systemctl restart php8.2-fpm
```

### 4. Vite & Frontend Issues

#### Problem: Vite HMR tidak jalan
**Symptoms:**
- Perubahan code tidak auto-reload
- Console error: `WebSocket connection failed`

**Solutions:**
```bash
# Cek APP_URL di .env
APP_URL=http://localhost

# Cek vite.config.ts
server: {
  host: 'localhost',
  port: 5173,
  hmr: {
    host: 'localhost',
  },
}

# Restart vite
npm run dev
```

#### Problem: Build production gagal
**Symptoms:**
```
npm run build
ERROR: Out of memory
```

**Solutions:**
```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Atau tambah di package.json
"build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
```

#### Problem: Assets tidak load di production
**Symptoms:**
- CSS/JS 404 error
- Blank page

**Solutions:**
```bash
# Build assets
npm run build

# Clear cache
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Cek public/build folder ada
ls -la public/build

# Cek APP_URL di .env production
APP_URL=https://yourdomain.com
```

### 5. Authentication Issues

#### Problem: Login redirect loop
**Symptoms:**
- Setelah login, redirect ke login lagi

**Solutions:**
```bash
# Clear session
php artisan session:flush

# Cek SESSION_DRIVER di .env
SESSION_DRIVER=database

# Migrate session table
php artisan session:table
php artisan migrate

# Clear browser cookies
```

#### Problem: 2FA QR code tidak muncul
**Symptoms:**
- Halaman 2FA setup blank

**Solutions:**
```bash
# Cek Fortify config
php artisan config:clear

# Pastikan feature enabled di config/fortify.php
Features::twoFactorAuthentication([
    'confirm' => true,
    'confirmPassword' => true,
]),

# Cek user table punya kolom two_factor_*
php artisan migrate:status
```

#### Problem: Email verification tidak terkirim
**Symptoms:**
- User tidak terima email

**Solutions:**
```bash
# Cek MAIL config di .env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password

# Test email
php artisan tinker
Mail::raw('Test', function($msg) {
    $msg->to('test@example.com')->subject('Test');
});

# Cek queue jika pakai queue
php artisan queue:work
```

### 6. Queue Issues

#### Problem: Queue job tidak jalan
**Symptoms:**
- Job stuck di database

**Solutions:**
```bash
# Cek QUEUE_CONNECTION di .env
QUEUE_CONNECTION=database

# Migrate jobs table
php artisan queue:table
php artisan migrate

# Run queue worker
php artisan queue:work --tries=3

# Atau setup supervisor (production)
sudo supervisorctl status singgah-worker
sudo supervisorctl restart singgah-worker:*
```

#### Problem: Queue worker mati terus
**Symptoms:**
- Supervisor log: `FATAL Exited too quickly`

**Solutions:**
```bash
# Cek error log
tail -f storage/logs/laravel.log

# Cek supervisor config
cat /etc/supervisor/conf.d/singgah-worker.conf

# Pastikan path benar
command=php /var/www/singgah/artisan queue:work

# Restart supervisor
sudo supervisorctl reread
sudo supervisorctl update
```

### 7. AI Service Issues

#### Problem: AI chat tidak response
**Symptoms:**
```
Maaf, layanan AI sedang tidak dapat diakses
```

**Solutions:**
```bash
# Cek .env config
SUMOPOD_API_KEY=your_api_key
SUMOPOD_URL=https://api.sumopod.com/v1/chat/completions
SUMOPOD_MODEL=gpt-4

# Test API key
curl -X POST $SUMOPOD_URL \
  -H "Authorization: Bearer $SUMOPOD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4","messages":[{"role":"user","content":"test"}]}'

# Cek rate limit
# AI chat: 30 request/menit
```

#### Problem: AI response lambat
**Symptoms:**
- Timeout error

**Solutions:**
```php
// Increase timeout di AiRagService.php
Http::withToken($apiKey)
    ->timeout(60)  // Increase dari 25 ke 60 detik
    ->retry(2, 1000)  // Retry 2x dengan delay 1 detik
    ->post($url, $payload);
```

### 8. Performance Issues

#### Problem: Halaman load lambat
**Symptoms:**
- Page load > 3 detik

**Solutions:**
```bash
# Enable cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize autoloader
composer dump-autoload --optimize

# Enable OPcache di php.ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000

# Cek N+1 query problem
# Install Laravel Debugbar (development)
composer require barryvdh/laravel-debugbar --dev
```

#### Problem: Database query lambat
**Symptoms:**
- Query > 1 detik

**Solutions:**
```bash
# Enable query log
DB::enableQueryLog();
// ... your code
dd(DB::getQueryLog());

# Add indexes
php artisan make:migration add_indexes_to_villages_table

# Di migration:
$table->index('status');
$table->index('is_featured');
$table->index(['status', 'is_featured']);

# Optimize PostgreSQL
VACUUM ANALYZE;
REINDEX DATABASE singgah;
```

### 9. Production Deployment Issues

#### Problem: 500 Internal Server Error
**Symptoms:**
- Blank page dengan 500 error

**Solutions:**
```bash
# Cek error log
tail -f storage/logs/laravel.log
tail -f /var/log/nginx/error.log

# Set permission
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Cek .env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:...
```

#### Problem: Assets 404 di production
**Symptoms:**
- CSS/JS tidak load

**Solutions:**
```bash
# Build assets
npm run build

# Cek public/build folder
ls -la public/build

# Cek Nginx config
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Restart Nginx
sudo systemctl restart nginx
```

#### Problem: HTTPS redirect loop
**Symptoms:**
- Too many redirects

**Solutions:**
```nginx
# Nginx config
# Pastikan hanya satu redirect rule
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# Di Laravel .env
APP_URL=https://yourdomain.com

# Jika pakai load balancer/proxy
# Tambah di app/Http/Middleware/TrustProxies.php
protected $proxies = '*';
```

---

## 📞 SUPPORT & RESOURCES

### Dokumentasi Terkait
- [DOKUMENTASI_SISTEM_SINGGAH.md](./DOKUMENTASI_SISTEM_SINGGAH.md) - Dokumentasi lengkap sistem
- [README.md](./README.md) - README utama project

### External Resources
- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

---

**Jika masalah masih berlanjut, silakan buat issue di GitHub repository dengan informasi:**
1. Error message lengkap
2. Laravel version (`php artisan --version`)
3. PHP version (`php -v`)
4. Database type & version
5. Steps to reproduce
