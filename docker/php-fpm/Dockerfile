ARG PHP_VERSION

FROM php:${PHP_VERSION}-fpm

RUN apt-get update && apt-get install -y \
    libpq-dev \
    zlib1g-dev \
    libpng-dev \
    libicu-dev

RUN docker-php-ext-install pdo pdo_mysql intl opcache gd
RUN docker-php-ext-enable gd

ARG UID
ARG GID

RUN groupadd -g ${GID} app && \
    useradd -m -u ${UID} -g ${GID} app

COPY www.conf /usr/local/etc/php-fpm.d/www.conf
