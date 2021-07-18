ARG PHP_VERSION

FROM php:${PHP_VERSION}-fpm
ENV PHP_MEMORY_LIMIT=256M

RUN apt-get update && apt-get install -y \
    libpq-dev \
    zlib1g-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libicu-dev \
    libzip-dev \
    vim

RUN docker-php-ext-install -j$(nproc) gd zip pdo pdo_mysql intl opcache gd
RUN docker-php-ext-enable gd
RUN docker-php-ext-enable zip

ARG UID
ARG GID

RUN groupadd -g ${GID} app && \
    useradd -m -u ${UID} -g ${GID} app

# Use the default production configuration
#RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY www.conf /usr/local/etc/php-fpm.d/www.conf
