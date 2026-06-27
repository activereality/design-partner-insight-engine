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

The note detail route can run deterministic mock extraction and display generated insight cards grouped by type.

## Configuration

The frontend only uses public-safe Vite configuration:

- `VITE_API_BASE_URL`

Copy `.env.example` to `.env` for local overrides if needed. Never put backend secrets, MongoDB connection strings, AI provider keys, tokens, credentials, or private data in frontend environment variables.

## Security Notes

- The health check displays safe status fields only.
- Raw backend errors, stack traces, connection strings, provider responses, and secrets are not shown.
- Do not enter or commit real customer notes, private interview details, recruiter messages, employer data, or private Gitwit/Mechro details.
- Project and note forms are for synthetic/demo content only.
- The mock extraction UI calls the backend only; no real provider key or provider response is exposed to the frontend.
- Generated evidence snippets are displayed for review context and should still be treated as potentially sensitive.

## Intentionally Not Implemented Yet

- Insight review UI
- Dashboard UI
- Authentication
- Real AI provider extraction UI
- Demo seed/reset UI
- TanStack Query
