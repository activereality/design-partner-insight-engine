# SignalForge API

Minimal NestJS + TypeScript API shell for SignalForge, the Design Partner Insight Engine.

## Commands

- `pnpm --filter @signalforge/api dev`
- `pnpm --filter @signalforge/api build`
- `pnpm --filter @signalforge/api start`
- `pnpm --filter @signalforge/api typecheck`
- `pnpm --filter @signalforge/api lint`
- `pnpm --filter @signalforge/api test`

## Configuration

The API reads configuration from environment variables. Copy `.env.example` to `.env` for local development only; never commit `.env`.

Required values:

- `PORT`
- `NODE_ENV`
- `MONGODB_URI`

The sample MongoDB URI uses local-development-only credentials from the root `docker-compose.yml`.

## Local MongoDB

Start MongoDB from the repo root:

```bash
docker compose up -d
```

Stop it when finished:

```bash
docker compose down
```

The Compose file is for local development only and uses a named Docker volume.

## Health Endpoint

`GET /api/health`

Expected response:

```json
{
  "status": "ok",
  "service": "signalforge-api",
  "database": "connected"
}
```

## Security Notes

- Global validation is enabled for future DTO-based endpoints.
- Environment values are validated at startup.
- Database configuration stays server-side.
- The app should not log request bodies, raw notes, prompts, provider responses, or secrets.
- API responses should stay sanitized and avoid connection strings, stack traces, internal DB errors, or debug payloads.
- Future product modules should scope data access by project ID.

## Intentionally Not Implemented Yet

- Product/domain modules
- Projects, notes, insights, or extraction endpoints
- AI provider abstraction or provider packages
- Auth
- Seed data
- React frontend
