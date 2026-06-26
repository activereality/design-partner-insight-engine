# SignalForge Web

Minimal Vite + React + TypeScript frontend shell for SignalForge, the Design Partner Insight Engine.

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

## Configuration

The frontend only uses public-safe Vite configuration:

- `VITE_API_BASE_URL`

Copy `.env.example` to `.env` for local overrides if needed. Never put backend secrets, MongoDB connection strings, AI provider keys, tokens, credentials, or private data in frontend environment variables.

## Security Notes

- The health check displays safe status fields only.
- Raw backend errors, stack traces, connection strings, provider responses, and secrets are not shown.
- Do not enter or commit real customer notes, private interview details, recruiter messages, employer data, or private Gitwit/Mechro details.

## Intentionally Not Implemented Yet

- Project CRUD UI
- Notes UI
- Insight review UI
- Dashboard UI
- Authentication
- AI extraction UI
- Demo seed/reset UI
- TanStack Query
