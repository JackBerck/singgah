# Stage 1: Build Assets & PHP Dependencies
FROM php:8.4-alpine AS builder
WORKDIR /app

# Install Node.js & NPM
RUN apk add --no-cache nodejs npm

# Install PHP Extension Installer
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# Install ekstensi yang dibutuhkan untuk build & artisan
RUN install-php-extensions pdo_mysql pdo_pgsql gd bcmath zip

# Ambil composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Salin semua file
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Generate Key & Build Frontend
RUN cp .env.example .env && \
    php artisan key:generate && \
    npm install && \
    npm run build


# Stage 2: Production Image (Final)
FROM php:8.4-fpm-alpine

# Install PHP Extension Installer lagi untuk stage ini
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# Install runtime dependencies (Nginx, Supervisor, dll)
RUN apk add --no-cache nginx supervisor

# Install ekstensi PHP untuk runtime (Sama seperti builder)
RUN install-php-extensions pdo_mysql pdo_pgsql opcache gd bcmath zip

# Optimasi OPcache untuk STB (RAM Kecil)
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.memory_consumption=32" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.max_accelerated_files=4000" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/opcache.ini

WORKDIR /var/www/html

# Salin hasil dari stage builder (termasuk vendor dan public/build)
COPY --from=builder /app .

# Konfigurasi Nginx & Supervisor
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisord.conf

# Set permissions & setup log
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod +x docker/start-container.sh \
    && mkdir -p /var/log/supervisor

EXPOSE 80

ENTRYPOINT ["docker/start-container.sh"]
