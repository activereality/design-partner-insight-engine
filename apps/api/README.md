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
- `AI_PROVIDER`
- `DEMO_TOOLS_ENABLED`

The sample MongoDB URI uses local-development-only credentials from the root `docker-compose.yml`.

AI provider values:

- `AI_PROVIDER=mock` is the default and requires no API key.
- `AI_PROVIDER=openai` enables the server-side OpenAI provider.
- `OPENAI_API_KEY` and `OPENAI_MODEL` are required only when `AI_PROVIDER=openai`.

Never put provider keys in frontend configuration. OpenAI keys are server-side only.

Demo tool values:

- `DEMO_TOOLS_ENABLED=false` is the safe default.
- `DEMO_TOOLS_ENABLED=true` enables local seed/reset endpoints only when `NODE_ENV` is not `production`.
- Demo seed/reset never calls real AI providers and must not be enabled for production data.

## Local MongoDB

Start MongoDB from the repo root:

```bash
docker-compose up -d
```

Stop it when finished:

```bash
docker-compose down
```

The Compose file is for local development only and uses a named Docker volume.

The repo also includes local PowerShell helpers:

- `scripts/dev-start.ps1`
- `scripts/dev-health.ps1`
- `scripts/dev-stop.ps1`

See `docs/14-local-runbook.md` for the full local runbook.

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

Extraction and insights:

- `POST /api/notes/:noteId/extract`
- `GET /api/extraction-runs/:runId`
- `GET /api/projects/:projectId/insights`
- `GET /api/notes/:noteId/insights`
- `GET /api/insights/:insightId`
- `PATCH /api/insights/:insightId`
- `POST /api/insights/:insightId/accept`
- `POST /api/insights/:insightId/reject`
- `POST /api/insights/:insightId/needs-follow-up`
- `GET /api/projects/:projectId/dashboard`
- `POST /api/demo/seed`
- `POST /api/demo/reset`

Extraction derives `projectId` from the note server-side, creates an extraction run, stores generated `InsightItem` records, and validates output before persistence. The mock provider is deterministic and local-only. The OpenAI provider is optional and server-side only.

Provider output is validated against `design_partner_extraction.v1` before any insights are persisted. Invalid output fails safely and does not expose raw validation details to frontend responses.

Insight review actions update review metadata only. Insight edits allow bounded `title`, `summary`, and `reviewNotes` fields; clients cannot edit internal payloads, evidence, extraction metadata, project scope, note scope, provider details, or raw provider output.

Dashboard aggregation is project-scoped. It summarizes accepted and edited insights as primary signal, tracks needs-follow-up and unreviewed AI-generated insights separately, excludes rejected insights from primary recommendations, and returns no internal `payload`, extraction `rawResponse`, full note `rawText`, provider details, or secrets.

Demo seed/reset is gated by `DEMO_TOOLS_ENABLED=true` and non-production `NODE_ENV`. Seed creates the synthetic OnboardIQ project, 3 notes, deterministic mock extraction runs, reviewed insights, and dashboard-ready signal. Reset deletes only records marked with `isDemo: true` and `demoKey: "onboardiq"`.

## Security Notes

- Global validation is enabled for future DTO-based endpoints.
- Project and note DTOs validate required fields, lengths, enums, dates, and ObjectId route params.
- Environment values are validated at startup.
- Database configuration stays server-side.
- The app should not log request bodies, raw notes, prompts, provider responses, or secrets.
- API responses should stay sanitized and avoid connection strings, stack traces, internal DB errors, or debug payloads.
- Note list/create access is project-scoped so future workspace/user authorization can be added cleanly.
- Full raw note text is returned only by note detail/update endpoints that need it for editing.
- Extraction run responses do not expose raw provider/debug payloads, and mock `rawResponse` metadata does not store raw note text.
- Insight responses omit internal `payload`; evidence snippets should still be treated as potentially sensitive.
- Review edits and reviewer notes may contain source-derived context and should not be logged.
- Dashboard responses are compact, project-scoped, and omit internal payloads, raw responses, provider details, and full note text.
- Demo tools are disabled by default, production-blocked, synthetic-only, and scoped to marked OnboardIQ demo data.
- OpenAI prompts and raw provider responses are not logged, persisted in full, or returned to the frontend.

## Intentionally Not Implemented Yet

- Auth
- Anthropic/Gemini providers
