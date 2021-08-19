#!/bin/bash

echo "-> APP DOWN"
/opt/php/8.0/bin/php artisan down

echo -e "\n-> GIT PULL"
git pull

echo -e "\n-> COMPOSER INSTALL"
composer install --ignore-platform-reqs
/opt/php/8.0/bin/php artisan package:discover --ansi

echo -e "\n-> MIGRATE"
/opt/php/8.0/bin/php artisan migrate --force

echo -e "\n-> CONFIG CLEAR"
/opt/php/8.0/bin/php artisan config:clear

echo -e "\n-> APP UP"
/opt/php/8.0/bin/php artisan up

echo -e "\n-> APP QUEUE RESTART"
/opt/php/8.0/bin/php artisan queue:restart
