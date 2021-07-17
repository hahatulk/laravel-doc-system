ARG PHP_VERSION

FROM php:${PHP_VERSION}-cli

RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    wget

RUN docker-php-ext-install pdo_mysql

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

ARG UID
ARG GID

RUN groupadd -g ${GID} app && \
    useradd -m -u ${UID} -g ${GID} app

USER app

WORKDIR /var/www/app
