# SignalForge API

NestJS + TypeScript API for SignalForge, the Design Partner Insight Engine.

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

## Project And Note Endpoints

Projects:

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:projectId`
- `PATCH /api/projects/:projectId`

Research notes:

- `GET /api/projects/:projectId/notes`
- `POST /api/projects/:projectId/notes`
- `GET /api/notes/:noteId`
- `PATCH /api/notes/:noteId`
- `DELETE /api/notes/:noteId`

Notes are created and listed through the route `projectId`; the client does not provide or control note ownership scope.

Note list and create responses use a summary shape with no full `rawText`. They may include a short `rawTextPreview`. Note detail and update responses include full `rawText` for the edit workflow.

## Security Notes

- Global validation is enabled for future DTO-based endpoints.
- Project and note DTOs validate required fields, lengths, enums, dates, and ObjectId route params.
- Environment values are validated at startup.
- Database configuration stays server-side.
- The app should not log request bodies, raw notes, prompts, provider responses, or secrets.
- API responses should stay sanitized and avoid connection strings, stack traces, internal DB errors, or debug payloads.
- Note list/create access is project-scoped so future workspace/user authorization can be added cleanly.
- Full raw note text is returned only by note detail/update endpoints that need it for editing.

## Intentionally Not Implemented Yet

- Insights, extraction runs, or dashboard endpoints
- AI provider abstraction or provider packages
- Auth
- Seed data
