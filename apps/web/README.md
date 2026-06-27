# SignalForge Web

Vite + React + TypeScript frontend for SignalForge, the Design Partner Insight Engine.

## Commands

- `pnpm --filter @signalforge/web dev`
- `pnpm --filter @signalforge/web build`
- `pnpm --filter @signalforge/web preview`
- `pnpm --filter @signalforge/web typecheck`
- `pnpm --filter @signalforge/web lint`
- `pnpm --filter @signalforge/web test`

## Routes

- `/`
- `/projects`
- `/projects/new`
- `/projects/:projectId`
- `/projects/:projectId/notes/:noteId`

The home route includes gated demo seed/reset controls. The project detail route renders a reviewed-signal dashboard and synthetic note intake. The note detail route can run extraction, display generated insight cards grouped by type, and support human review actions: accept, reject, needs follow-up, and bounded title/summary/review-note edits.

## Configuration

The frontend only uses public-safe Vite configuration:

- `VITE_API_BASE_URL`

Copy `.env.example` to `.env` for local overrides if needed. Never put backend secrets, MongoDB connection strings, AI provider keys, tokens, credentials, or private data in frontend environment variables.

For local startup, use `scripts/dev-start.ps1` from the repo root or follow `docs/14-local-runbook.md`.

## Security Notes

- The health check displays safe status fields only.
- Raw backend errors, stack traces, connection strings, provider responses, and secrets are not shown.
- Do not enter or commit real customer notes, private interview details, recruiter messages, employer data, or private Gitwit/Mechro details.
- Project and note forms are for synthetic/demo content only.
- The extraction UI calls the backend only; no provider key or raw provider response is exposed to the frontend.
- Generated evidence snippets are displayed for review context and should still be treated as potentially sensitive.
- Review edits and reviewer notes are treated as potentially source-derived content; the UI does not log them or expose internal payloads.
- Dashboard UI displays safe aggregated DTOs only and does not receive internal payloads, raw provider responses, provider details, or full note text.
- Demo controls call backend seed/reset endpoints, show generic disabled/error states, and link to the seeded dashboard when local demo tools are enabled.

## Intentionally Not Implemented Yet

- Authentication
- Provider comparison UI
- TanStack Query
