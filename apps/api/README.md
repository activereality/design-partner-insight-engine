# SignalForge API

Minimal NestJS + TypeScript API shell for SignalForge, the Design Partner Insight Engine.

## Commands

- `pnpm --filter @signalforge/api dev`
- `pnpm --filter @signalforge/api build`
- `pnpm --filter @signalforge/api start`
- `pnpm --filter @signalforge/api typecheck`
- `pnpm --filter @signalforge/api lint`
- `pnpm --filter @signalforge/api test`

## Health Endpoint

`GET /api/health`

Expected response:

```json
{
  "status": "ok",
  "service": "signalforge-api"
}
```

## Configuration

The API reads `PORT` from the environment and defaults to `3000`. See `.env.example`; never commit `.env`.

## Security Notes

- Global validation is enabled for future DTO-based endpoints.
- The app should not log request bodies, raw notes, prompts, provider responses, or secrets.
- API responses should stay sanitized and avoid stack traces or internal debug payloads.
- Future product modules should scope data access by project ID.

## Intentionally Not Implemented Yet

- MongoDB or Mongoose
- Product/domain modules
- Projects, notes, insights, or extraction endpoints
- AI provider abstraction or provider packages
- Auth
- Seed data
- React frontend
