# Flippy Backend

Separate Go backend service for Flippy.

## Stack

- Go
- PostgreSQL
- SQL migrations
- Layered architecture with `handler`, `service`, and `repository`

## Structure

```text
backend/
  cmd/api/
  docs/
  internal/
    config/
    domain/
    handler/http/
    repository/
    server/
    service/
  migrations/
```

## Quick Start

```bash
cp .env.example .env
go mod tidy
go run ./cmd/api
```

Server health endpoint:

```text
GET /health
```

## Implemented Endpoints

```text
GET  /health
GET  /api/v1/courses
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
GET  /api/v1/flashcard-sets
GET  /api/v1/flashcard-sets/:slug
GET  /api/v1/flashcard-sets/:slug/cards
POST /api/v1/flashcard-sets
PATCH /api/v1/flashcard-sets/:slug
DELETE /api/v1/flashcard-sets/:slug
POST /api/v1/flashcard-sets/:slug/cards
PATCH /api/v1/flashcards/:id
DELETE /api/v1/flashcards/:id
```

`/api/v1/auth/me` expects:

```text
Authorization: Bearer <access_token>
```

Protected flashcard-set write routes also require the same Bearer token.
Flashcard create, update, and delete routes require the same Bearer token.

## Environment

Most hosts will only need these:

```text
APP_ENV=production
PORT=8080
APP_BASE_URL=https://your-api-host.com
CORS_ALLOWED_ORIGINS=https://flippy-playground.vercel.app,http://localhost:3000
DATABASE_URL=postgres://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
```

Notes:
- `DATABASE_URL` is preferred in production.
- `PORT` is supported automatically for Railway/Render/Fly-style platforms.
- `CORS_ALLOWED_ORIGINS` should include your Vercel frontend URL.

## Database

Core schema is defined in:

- `migrations/000001_init_schema.up.sql`
- `migrations/000001_init_schema.down.sql`
- `docs/database-schema.md`

Apply the migration before starting the API in production.

## Deploying

Recommended setup:
- frontend: Vercel
- backend: Railway, Render, or Fly.io
- database: Railway Postgres, Neon, Supabase Postgres, or Render Postgres

Suggested flow for the separate `Flippy-Backend` repo:

1. Copy this `backend/` directory into the root of `Flippy-Backend`.
2. Push the repo.
3. Provision PostgreSQL.
4. Run `migrations/000001_init_schema.up.sql` on that database.
5. Set the environment variables listed above.
6. Deploy using the included `Dockerfile` or native Go buildpack support.
7. Point the frontend to `https://your-api-host.com/api/v1`.

## Planned Domains

- auth
- users
- courses
- flashcard sets
- flashcards
- learning progress

## Frontend Integration

Point the Next.js frontend services to the Go backend base URL, for example:

```text
http://localhost:8080/api/v1
```

Production example:

```text
https://your-api-host.com/api/v1
```

Good first integrations:
- login
- register
- fetch current user
- fetch courses

## Password Reset Email

Recommended setup with Resend API:

```text
MAIL_FROM=onboarding@resend.dev
RESEND_API_KEY=re_your_resend_api_key
```

Notes:
- `RESEND_API_KEY` is used directly by the backend to send reset emails through Resend.
- `onboarding@resend.dev` is fine for testing. For production, verify your own domain in Resend and use a sender like `noreply@yourdomain.com`.

Optional SMTP fallback:

```text
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=your_resend_smtp_password
```
