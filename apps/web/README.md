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

## Configuration

The frontend only uses public-safe Vite configuration:

- `VITE_API_BASE_URL`

Copy `.env.example` to `.env` for local overrides if needed. Never put backend secrets, MongoDB connection strings, AI provider keys, tokens, credentials, or private data in frontend environment variables.

## Security Notes

- The health check displays safe status fields only.
- Raw backend errors, stack traces, connection strings, provider responses, and secrets are not shown.
- Do not enter or commit real customer notes, private interview details, recruiter messages, employer data, or private Gitwit/Mechro details.
- Project and note forms are for synthetic/demo content only.

## Intentionally Not Implemented Yet

- Insight review UI
- Dashboard UI
- Authentication
- AI extraction UI
- Demo seed/reset UI
- TanStack Query
