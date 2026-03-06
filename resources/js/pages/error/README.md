# Error Pages

Sistem error handling untuk menampilkan halaman error yang user-friendly ketika terjadi kesalahan pada aplikasi.

## Error Pages yang Tersedia

### Client Errors (4xx)

- **400 - Bad Request**: Permintaan tidak valid
- **401 - Unauthorized**: Belum login/tidak terautentikasi
- **403 - Forbidden**: Tidak memiliki akses/izin
- **404 - Not Found**: Halaman tidak ditemukan

### Server Errors (5xx)

- **500 - Server Error**: Kesalahan internal server
- **503 - Service Unavailable**: Layanan sedang maintenance

## Fitur

Setiap error page memiliki:

- ✅ Icon dan visual yang sesuai dengan tipe error
- ✅ Status code yang jelas
- ✅ Pesan error yang informatif dalam Bahasa Indonesia
- ✅ Tombol aksi (Kembali/Ke Beranda/Login)
- ✅ Design yang konsisten dengan tema aplikasi (Singgah)
- ✅ Responsive untuk mobile dan desktop

## Cara Testing Error Pages

### Development Mode

Untuk testing error pages di environment `local`, gunakan URL berikut:

```
http://localhost/test-error/400  # Bad Request
http://localhost/test-error/401  # Unauthorized
http://localhost/test-error/403  # Forbidden
http://localhost/test-error/404  # Not Found
http://localhost/test-error/500  # Server Error
http://localhost/test-error/503  # Service Unavailable
```

**Catatan**: Routes test error hanya tersedia di environment `local` dan otomatis tidak aktif di production.

### Manual Testing

Anda juga bisa trigger error secara manual di controller dengan:

```php
// Di dalam controller method
abort(404); // Trigger 404 error
abort(403); // Trigger 403 error
abort(500); // Trigger 500 error
```

## Konfigurasi

### Error Handling Configuration

Error handling dikonfigurasi di `bootstrap/app.php`:

```php
->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->respond(function (Response $response) {
        // Logic untuk map status code ke error page
    });
})
```

### Error Page Components

Komponen error page berada di:

```
resources/js/pages/error/
├── 400.tsx
├── 401.tsx
├── 403.tsx
├── 404.tsx
├── 500.tsx
└── 503.tsx
```

## Customization

Untuk mengubah tampilan error page:

1. Edit file di `resources/js/pages/error/[status].tsx`
2. Ubah pesan, icon, atau styling sesuai kebutuhan
3. Pastikan tetap menggunakan design system yang konsisten

## Production Deployment

1. **Hapus/Comment Test Routes**: Di `routes/web.php`, pastikan test routes di-comment atau dihapus:

    ```php
    // Comment atau hapus bagian ini di production
    if (app()->environment('local')) {
        Route::prefix('test-error')->group(function () {
            // ...
        });
    }
    ```

2. **Laravel Debug Mode**: Pastikan `APP_DEBUG=false` di `.env` production untuk menghindari expose error details.

3. **Error Logging**: Error tetap akan di-log di `storage/logs/laravel.log` untuk monitoring dan debugging.

## Best Practices

1. **Jangan Expose Sensitive Data**: Error pages tidak menampilkan detail teknis error (stack trace, dll).

2. **Gunakan Status Code yang Tepat**:
    - 4xx untuk client errors (kesalahan user)
    - 5xx untuk server errors (kesalahan sistem)

3. **Provide Clear Actions**: Setiap error page menyediakan tombol untuk user action selanjutnya.

4. **Monitor Errors**: Gunakan error logging untuk monitoring error patterns di production.

## Troubleshooting

### Error Page Tidak Muncul

- Pastikan Inertia middleware sudah terkonfigurasi dengan benar
- Check apakah error page component sudah dibuat di `resources/js/pages/error/`
- Verify configuration di `bootstrap/app.php`

### Styling Tidak Muncul

- Pastikan TailwindCSS sudah compiled: `npm run build`
- Check apakah CSS variables untuk Singgah theme sudah didefinisikan

### Test Routes Tidak Bekerja

- Pastikan environment adalah `local`
- Check `app()->environment()` di `routes/web.php`
