## Чтобы запустить проект локально:
1. Склонировать репозиторий: ``git clone https://github.com/AlexeiZaits/personalBlog``
2. Создайте и заполните ``.env`` файл в папке backend:
3. Запустите docker ``docker-compose up --build``
4. Проект будет доступен по адресу ``http://0.0.0.0:5174/``

```
# Описание .env:
PORT=
DB_HOST=
DB_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
JWT_ACCESS_TOKEN=
JWT_REFRESH_TOKEN=
accessKeyId=
secretAccessKey=
```
