
# Требования:
- Composer
- Docker (рекомендуемый способ)

### Инструкция по установке через Docker

Копируем файл конфигурации
```shell
cp .env.example .env
```

Заполняем поля в `.env`:
```
DB_DATABASE=<любое значение>
DB_USERNAME=<любое значение>
DB_PASSWORD=<любое значение>
```

Поля `DOCKER_COMPOSE_UID` и `DOCKER_COMPOSE_GID` нужно заполнить UID и GID значениями локального пользователя.

- Linux/Mac узнать UID/GID можно командой `id`
- Windows попробовать использовать значение `1000` для uid, gid (не тестировалось)

Собираем контейнеры и запускаем:
```shell
docker-compose up --build -d
или
npm run docker
```

Устанавливаем зависимости:
```shell
docker-compose run workspace composer i
или
npm run dep
```

Генерируем ключ приложения:
```shell
docker-compose run workspace composer run-script post-create-project-cmd
или
npm run larkey
```

Накатываем базу и тестовые данные:
```shell
docker-compose run workspace php artisan migrate:fresh --seed
или
npm run migrate
```

# Сборка frontend

Для сборки фронта сначала качаем все зависимости
```shell
npm install
```

Запускаем в watch режиме
```shell
npm run watch
```

Запускаем в hot-reload режиме, более удобен для разработки
```shell
npm run hot
```

Сборка для прода
```shell
npm run prod
```

# Инструкция по установке зависимостей на Ubuntu 20.04+

### PHP 8.0

```shell
sudo add-apt-repository ppa:ondrej/php -y
sudo apt-get install -y php8.0-cli php8.0-mysql php8.0-mbstring php8.0-pgsql php8.0-sqlite3 php8.0-gd php8.0-sybase php8.0-bz2 php8.0-curl php8.0-xml php8.0-intl php8.0-zip
```

### Composer

```shell
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

### NodeJS

```shell
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Docker

```shell
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
```
