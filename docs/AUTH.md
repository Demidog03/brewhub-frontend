# Документация по авторизации

API использует **двухуровневую** систему аутентификации:

1. **JWT** — для управления учётной записью пользователя (создание/просмотр/удаление API-ключей). Короткоживущий токен (5 минут).
2. **API-ключ** — для операций над ресурсами (книги, авторы). Долгоживущий ключ, передаётся в заголовке `X-API-Key`.

Поверх этого работает **ролевая модель** (`user` / `admin`).

Всё реализовано **без внешних auth-библиотек** — на нативном JWT из Hono и модуле `node:crypto`.

---

## Стек

| Компонент | Технология |
|-----------|------------|
| Фреймворк | Hono 4 (`@hono/node-server`) |
| JWT | `hono/jwt` (HS256) |
| Хеш пароля | `node:crypto` → `scrypt` + случайная соль |
| Хеш API-ключа | `node:crypto` → `sha256` |
| Валидация | Zod + `@hono/standard-validator` |
| БД / ORM | PostgreSQL + Drizzle ORM |

---

## Переменные окружения

Определяются и валидируются в [src/data/env.ts](../src/data/env.ts):

| Переменная | Назначение |
|------------|------------|
| `JWT_SECRET` | Секрет для подписи/проверки JWT (обязательно) |
| `PORT` | Порт сервера (по умолчанию 3000) |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Подключение к PostgreSQL |

> ⚠️ `JWT_SECRET` — критичный секрет. В проде используйте длинное случайное значение и не коммитьте `.env`.

---

## Модель данных

### Таблица `users` — [src/db/schemas/users.ts](../src/db/schemas/users.ts)

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | UUID (PK) | Генерируется автоматически |
| `name` | text | Имя пользователя |
| `email` | text, unique | Уникальный e-mail |
| `passwordHash` | text | Формат `salt:hash` (scrypt) |
| `role` | enum `user` \| `admin` | По умолчанию `user` |
| `createdAt` | timestamptz | Дата создания |

### Таблица `api_keys` — [src/db/schemas/apiKeys.ts](../src/db/schemas/apiKeys.ts)

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | UUID (PK) | |
| `userId` | UUID (FK → users, ON DELETE CASCADE) | Владелец ключа |
| `name` | text | Понятное имя ключа |
| `keyHash` | text | SHA-256 от «сырого» ключа |
| `keyPrefix` | varchar(8) | Первые 8 символов (для отображения) |
| `createdAt` | timestamptz | |

> Сессий в БД нет — JWT **stateless**. «Сырой» API-ключ нигде не хранится: в БД только его SHA-256.

---

## Безопасность паролей и ключей

Реализация — [src/lib/crypto.ts](../src/lib/crypto.ts).

**Пароль (`hashPassword` / `verifyPassword`):**
- Случайная соль 16 байт, ключ 64 байта через `scrypt`.
- Хранится как `salt:hash` (hex).
- Проверка через `timingSafeEqual` — защита от timing-атак.

**API-ключ (`generateApiKey` / `hashApiKey`):**
- «Сырой» ключ — 32 случайных байта в base64.
- В БД сохраняется `sha256(raw)` и префикс из 8 символов.
- Сырой ключ показывается пользователю **один раз** при создании — потом восстановить нельзя.

---

## Эндпоинты

Базовые пути монтируются в [src/index.ts](../src/index.ts): `/auth`, `/api-keys`, `/books`, `/authors`.

### Аутентификация — [src/routes/auth.ts](../src/routes/auth.ts)

#### `POST /auth/register`
Регистрация нового пользователя.

Тело запроса:
```json
{ "name": "John Doe", "email": "user@example.com", "password": "min8chars" }
```
Валидация: имя **1..255 символов**; корректный e-mail; пароль **минимум 8 символов**.

Ответы:
- `201` → `{ "id": "uuid", "name": "John Doe", "email": "user@example.com" }`
- `409` → `{ "error": "Email already in use" }`

#### `POST /auth/login`
Вход, выдаёт JWT.

Тело запроса:
```json
{ "email": "user@example.com", "password": "..." }
```

Ответы:
- `200` → `{ "token": "<jwt>" }`
- `401` → `{ "error": "Invalid email or password" }`

Параметры JWT:
- Алгоритм `HS256`, подпись секретом `JWT_SECRET`.
- Payload: `{ sub: <userId>, email: <email>, exp: <unix+300s> }`.
- **Срок жизни — 5 минут** (`JWT_EXPIRATION_SECONDS = 5 * 60`).

#### `GET /auth/me`
Профиль текущего пользователя. Защищён JWT.

Заголовок запроса: `Authorization: Bearer <jwt>`. Пользователь берётся из `c.var.jwtPayload.sub`.

Ответы:
- `200` → `{ "id": "uuid", "name": "John Doe", "email": "user@example.com", "role": "user", "createdAt": "<timestamptz>" }`
- `401` → отсутствует/просрочен JWT
- `404` → `{ "error": "User not found" }`

---

### Управление API-ключами — [src/routes/apiKey.ts](../src/routes/apiKey.ts)

Все маршруты защищены JWT-мидлварой:
```ts
app.use(jwt({ secret: env.JWT_SECRET, alg: "HS256" }))
```
Заголовок запроса: `Authorization: Bearer <jwt>`. Пользователь берётся из `c.var.jwtPayload.sub`.

#### `GET /api-keys`
Список ключей текущего пользователя.
`200` → массив `{ id, name, keyPrefix, createdAt }` (без `keyHash`).

#### `POST /api-keys`
Создать ключ.

Тело: `{ "name": "string (1..255)" }`

`201` → `{ "key": "<сырой ключ>", "id": "uuid" }`
> Поле `key` возвращается **единственный раз** — сохраните его сразу.

#### `DELETE /api-keys/:id`
Удалить ключ. Удаляется только если он принадлежит текущему пользователю (`id` + `userId`).
`204` без тела.

---

### Защищённые ресурсы (API-ключ)

Операции записи над книгами и авторами требуют заголовок `X-API-Key`.
Мидлвара — [src/middleware/auth.ts](../src/middleware/auth.ts) (`apiKeyAuth`):

1. Читает `X-API-Key`. Нет/пусто → `401 Missing API Key`.
2. Считает `sha256(key)`, ищет в `api_keys`. Не найдено → `401 Invalid API Key`.
3. Находит пользователя по `userId`. Нет → `401 Invalid API Key`.
4. Кладёт в контекст `apiKeyUser = { id, role, email }`.

| Метод | Путь | Доступ |
|-------|------|--------|
| `GET` | `/books`, `/books/:id` | Публично |
| `POST` | `/books` | API-ключ (поле `addedBy` = владелец ключа) |
| `PUT` | `/books/:id` | API-ключ + правило ролей |
| `DELETE` | `/books/:id` | API-ключ + правило ролей |
| `GET` | `/authors`, `/authors/:id` | Публично |
| `POST`/`PUT`/`DELETE` | `/authors`, `/authors/:id` | API-ключ |

**Правило ролей для книг** ([src/routes/book.ts](../src/routes/book.ts)):
- `admin` — может изменять/удалять любую книгу.
- `user` — только свои книги (`addedBy === userId`). Иначе запись не найдётся → `404`.

```ts
const whereClause =
  role === "admin"
    ? eq(BookTable.id, id)
    : and(eq(BookTable.id, id), eq(BookTable.addedBy, userId))
```

---

## Типичный сценарий использования

```bash
# 1. Регистрация
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Me","email":"me@example.com","password":"supersecret"}'

# 2. Вход → получить JWT
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"me@example.com","password":"supersecret"}'
# → { "token": "<JWT>" }

# 3. Создать API-ключ (JWT в Authorization)
curl -X POST http://localhost:3000/api-keys \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"name":"my-laptop"}'
# → { "key": "<API_KEY>", "id": "..." }  (сохраните key!)

# 4. Создать книгу (API-ключ в X-API-Key)
curl -X POST http://localhost:3000/books \
  -H "X-API-Key: <API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Hono in Action","authorId":"<uuid>"}'
```

---

## Сводка кодов ошибок

| Код | Когда |
|-----|-------|
| `400` | Невалидное тело запроса (Zod); автор не найден при создании книги |
| `401` | Неверные учётные данные; отсутствует/просрочен JWT; отсутствует/неверный API-ключ |
| `404` | Ресурс не найден или нет прав на его изменение (для `user`) |
| `409` | E-mail уже занят при регистрации |

---

## Замечания по безопасности

- JWT живёт всего 5 минут и не обновляется — механизма refresh-токенов нет. Для долгого доступа предусмотрены API-ключи.
- В [src/middleware/auth.ts:14](../src/middleware/auth.ts#L14) есть отладочный `console.log(key)`, выводящий сырой API-ключ в логи — **стоит убрать перед продакшеном**.
- Храните `JWT_SECRET` и `.env` вне репозитория.
