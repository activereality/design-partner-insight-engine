# Security And Privacy

## Purpose

This document defines the security-forward and privacy-aware design posture for SignalForge. The current project is docs-first and synthetic-data-only, but future implementation should avoid choices that create avoidable security retrofits.

## Security Posture

SignalForge is a local-first portfolio artifact for now. It should still be designed as if raw discovery notes may become sensitive customer data later. Security work should be practical: validate inputs, keep secrets server-side, sanitize responses, avoid unsafe logging, and document MVP tradeoffs.

Do not add full authentication, authorization roles, billing security, SOC2 controls, encryption infrastructure, enterprise audit logging, or deployment security implementation in the MVP.

## Data Classification

- Public: README, docs, synthetic screenshots, synthetic demo scenarios.
- Internal application data: project names, tags, review statuses, dashboard summaries.
- Sensitive by design: raw research notes, evidence quotes, AI prompts, provider responses, extracted insight payloads, and failure details.
- Secret: provider API keys, tokens, credentials, private connection strings.

## Synthetic/Demo Data Policy

Only synthetic/demo data belongs in the public repo. Do not commit real customer notes, private Gitwit or Mechro details, interview/recruiter content, employer data, private notes, secrets, API keys, tokens, credentials, or copied customer material.

## Sensitive Fields By Domain Document

Project:

- `name` and `description` may become sensitive if users enter private product context.

ResearchNote:

- `rawText` is sensitive and should not be logged by default.
- `title` and `tags` may contain sensitive context and should be treated carefully.

ExtractionRun:

- `rawResponse` is sensitive/internal and should not be exposed to the frontend by default.
- `errorMessage` should be sanitized.

InsightItem:

- `payload` is potentially sensitive and should be internal unless explicitly mapped to a safe DTO.
- `evidence` is potentially sensitive because quotes can contain raw note language.
- `summary` and `title` may reveal sensitive product direction.
- `reviewNotes`, edited titles, and edited summaries may contain reviewer-entered source context and should be treated as potentially sensitive.

## Raw Notes Handling

Raw notes should be accepted only through validated backend DTOs. Do not log full note text by default. List and create responses should return note summaries without full `rawText`; detail/edit responses may include full `rawText` only when the workflow needs it. Responses should remain scoped to the project.

## AI Prompt And Provider-Response Handling

Prompts and provider responses may contain sensitive user data. Real provider calls must stay server-side. Provider keys must never be sent to the frontend. Raw provider responses should be normalized and validated before persistence or display.

The current provider path does not persist full raw provider responses in normal extraction runs. Any future raw-response persistence must be an explicit local/debug feature and must be revisited before deployment.

## Extracted Insights And Evidence Handling

Extracted insights may reveal source-note content, product direction, market assumptions, or design-partner feedback. Evidence quotes are especially sensitive because they intentionally preserve the source language that supports an insight.

Insight DTOs should expose only the fields needed for review. Internal payloads, debug metadata, raw provider output, and provider-specific traces should stay server-side unless a future feature explicitly defines a safe export path.

Review updates should be metadata- and review-field-only. Clients may update bounded title, summary, and review notes, or set explicit review statuses. Clients should not be able to update internal payloads, evidence, project scope, note scope, extraction metadata, provider metadata, raw responses, or generated-original fields.

Dashboard DTOs should aggregate reviewed signal without widening data exposure. Accepted and edited insights may appear as primary signal, needs-follow-up insights should remain unresolved, unreviewed AI-generated insights should stay separate, and rejected insights should be excluded from primary recommendations. Dashboard responses should not include full note `rawText`, internal insight `payload`, extraction `rawResponse`, raw provider output, provider details, or secrets.

## Logging Policy

Avoid logging:

- raw note contents
- AI prompts
- provider responses
- review edits or reviewer notes when they may contain source-derived details
- API keys
- tokens
- credentials
- internal stack traces in user-facing responses

Local debug logging may be temporarily enabled for synthetic data only and should be intentionally scoped.

## Validation Policy

Backend validation is required even when the UI validates. Prefer explicit DTOs, schemas, enums, ObjectId validation, and bounded text fields over loose untyped objects.

Invalid inputs should fail with clear, safe messages. Do not leak implementation details.

## Environment Configuration Policy

Use environment variables for configuration that differs by environment. Add `.env.example` only when configuration is introduced. Never commit `.env`.

Provider keys, connection strings, and credentials stay server-side. `OPENAI_API_KEY` is required only when `AI_PROVIDER=openai` and must never appear in frontend configuration.

## Frontend/Backend Boundary

The frontend should call typed API endpoints and receive safe DTOs. It should not receive provider secrets, raw provider responses, internal debug payloads, stack traces, or server-only configuration.

## MongoDB Data-Access Expectations

MongoDB/Mongoose queries should be scoped by `projectId` for project-owned resources. Do not trust client-provided ownership fields. Derive ownership relationships from route parameters and server-side lookups.

## Future Auth/Authorization Readiness

Auth is out of MVP, but APIs should be shaped so workspace/user authorization can be added later. Project-scoped routes and service methods are the main readiness mechanism.

## Future Rate Limiting Readiness

Rate limiting is out of MVP. Future external provider calls and write-heavy endpoints should have a natural place to add per-user, per-workspace, or per-project limits.

## Future Audit/Event Logging Readiness

Enterprise audit logging is out of MVP. Future event logging should record safe metadata such as actor, project ID, action, timestamp, and result without storing raw notes, prompts, or provider responses in general logs.

## Local Development Assumptions

- Synthetic data only.
- Mock AI provider default.
- No real provider keys required.
- No `.env` committed.
- Debug output remains minimal by default.
- Demo seed/reset tools are disabled unless explicitly enabled for local demo work.

## Demo Seed/Reset Safety

Demo tools are local-only and synthetic-only. `POST /api/demo/seed` and `POST /api/demo/reset` require `DEMO_TOOLS_ENABLED=true` and must be blocked when `NODE_ENV=production`.

Reset must delete only marked demo records, currently `isDemo: true` and `demoKey: "onboardiq"`. It must not wipe entire collections or delete arbitrary user-created projects, notes, extraction runs, or insights.

Demo seed must not call real AI providers, require provider keys, log raw seeded note text, or expose internal payloads/raw responses. Seeded records are synthetic but should still be treated as sensitive by design.

## Future Deployment Assumptions

Before deployment with non-demo data, add authentication, authorization, rate limiting, managed secrets, production-safe logging, data retention decisions, demo-tool production hardening/removal, and a review of raw provider-response persistence.

## Known MVP Security Tradeoffs

- No authentication in MVP.
- No role-based authorization in MVP.
- No production audit logging in MVP.
- No deployment secrets implementation in MVP.
- No rate limiting in MVP.
- Raw response persistence may exist only for local/debug and must be revisited before deployment.
- Demo tooling is local-only and disabled by default.

These are intentional tradeoffs because the MVP is local and synthetic-data-only.

## Security Checklist For Future Slices

- Confirm no secrets, API keys, tokens, credentials, private notes, or real customer data are committed.
- Confirm no `.env` is added.
- Add `.env.example` only when configuration is introduced.
- Keep mock provider working without API keys.
- Keep provider keys server-side only.
- Validate backend inputs with DTOs, schemas, enums, and bounded fields.
- Scope data access by project ID.
- Avoid trusting client-provided ownership fields.
- Avoid logging raw notes, prompts, provider responses, or secrets.
- Return sanitized errors to the frontend.
- Do not expose raw provider responses or internal debug payloads by default.
- Keep demo reset disabled by default and scoped only to marked synthetic demo data.
