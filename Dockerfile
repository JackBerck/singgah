# Stage 1: Build Assets & PHP Dependencies
FROM php:8.4-alpine AS builder
WORKDIR /app

# Install Node.js, NPM, dan alat build sistem
RUN apk add --no-cache nodejs npm icu-dev libpng-dev libjpeg-turbo-dev freetype-dev postgresql-dev libpq zlib-dev libzip-dev

# Install ekstensi PHP yang dibutuhkan Laravel agar bisa 'booting' (untuk Wayfinder)
RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql gd bcmath zip

# Ambil composer dari image resmi
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Salin semua file proyek
COPY . .

# 1. Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# 2. Siapkan .env dan Generate Key (Agar Laravel bisa booting tanpa error)
RUN cp .env.example .env && php artisan key:generate

# 3. Build Frontend (Inertia/React)
RUN npm install && npm run build


# Stage 2: Production Image (Minimal & Cepat)
FROM php:8.4-fpm-alpine

# Install runtime dependencies saja (lebih ringan)
RUN apk add --no-cache nginx supervisor libpng libjpeg-turbo freetype postgresql-libs libpq libzip

# Install ekstensi PHP yang sama untuk runtime
RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql opcache gd bcmath zip

# Optimasi OPcache untuk STB (RAM Kecil)
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.memory_consumption=32" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.max_accelerated_files=4000" >> /usr/local/etc/php/conf.d/opcache.ini

WORKDIR /var/www/html

# Salin folder vendor dan public/build dari stage builder
COPY --from=builder /app .

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod +x docker/start-container.sh

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisord.conf

RUN mkdir -p /var/log/supervisor

EXPOSE 80

ENTRYPOINT ["docker/start-container.sh"]
