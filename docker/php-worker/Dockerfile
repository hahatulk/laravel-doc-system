ARG PHP_VERSION

FROM php:${PHP_VERSION}-cli

RUN apt-get update && apt-get install -y \
    libpq-dev \
    supervisor

RUN docker-php-ext-install pdo_mysql

ARG UID
ARG GID

RUN groupadd -g ${GID} app && \
    useradd -m -u ${UID} -g ${GID} app

COPY supervisor/supervisord.conf /etc/supervisor/supervisord.conf
COPY supervisor/conf.d/* /etc/supervisor/conf.d/

CMD ["/usr/bin/supervisord", "-n"]
