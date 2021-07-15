ARG PHP_VERSION

FROM php:${PHP_VERSION}-fpm

RUN apt-get update && apt-get install -y \
    libpq-dev

RUN docker-php-ext-install pdo_mysql

ARG UID
ARG GID

RUN groupadd -g ${GID} app && \
    useradd -m -u ${UID} -g ${GID} app

COPY www.conf /usr/local/etc/php-fpm.d/www.conf
