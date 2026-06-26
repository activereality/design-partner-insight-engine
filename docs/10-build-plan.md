# Build Plan

Each slice should be small enough for a focused Codex prompt and commit.

## 1. Docs Foundation

Goal: establish README and project docs.

Scope: docs only.

Out of scope: app code, dependencies, package files.

Likely files: `README.md`, `docs/*`, `AGENTS.md` if needed.

Verification: docs exist, links work, forbidden scope terms only appear in boundary sections.

Security verification: no secrets, real notes, private company data, `.env`, app code, package files, Docker files, or dependencies are added.

Suggested commit: `docs: add signalforge project foundation`

## 2. Repo/Tooling Scaffold

Status: completed as initial root tooling only.

Goal: add basic monorepo tooling.

Scope: pnpm workspace metadata, root package scripts, shared TypeScript config, editor/formatting config, ignore rules, and placeholder workspace READMEs.

Out of scope: app behavior.

Likely files: root package/config files, `apps/api/README.md`, `apps/web/README.md`, `packages/shared/README.md`.

Verification: root placeholder scripts run without requiring app packages.

Security notes: add `.env.example` only if configuration is introduced; do not add `.env`.
Security verification: no secrets in config files, no committed `.env`, and no generated files containing private paths or tokens.

Suggested commit: `chore: scaffold signalforge tooling`

## 3. NestJS API Shell

Goal: create the backend shell.

Scope: NestJS app, health endpoint.

Out of scope: database and AI behavior.

Likely files: `apps/api/*`.

Verification: API starts and `GET /health` returns ok.

Security notes: add global validation plumbing early; return sanitized errors.
Security verification: validation is enabled, health response exposes no config/secrets, and error responses do not include stack traces in normal mode.

Suggested commit: `feat(api): add nestjs shell`

## 4. MongoDB/Mongoose Connection

Goal: connect the API to MongoDB.

Scope: config, connection module, basic model registration.

Out of scope: full CRUD.

Likely files: API config and persistence modules.

Verification: app starts with local connection string.

Security notes: read connection config from environment variables and keep `.env` uncommitted.
Security verification: `.env.example` documents required variables if introduced, `.env` is absent, and connection strings are not hard-coded.

Suggested commit: `feat(api): add mongodb mongoose connection`

## 5. React App Shell

Goal: create the frontend shell.

Scope: React + TypeScript app, routing, basic layout.

Out of scope: complete UI workflow.

Likely files: `apps/web/*`.

Verification: web app starts and renders initial route.

Security verification: no provider keys or server-only config appear in frontend code or bundled environment variables.

Suggested commit: `feat(web): add react app shell`

## 6. Projects And Notes CRUD

Goal: create and view projects and notes.

Scope: REST endpoints and UI forms/lists.

Out of scope: extraction.

Likely files: API project/note modules, web project/note pages.

Verification: create/list/read flows work with synthetic data.

Security notes: validate DTOs on the backend, scope reads/writes by project ID, and do not trust client-provided ownership fields.
Security verification: invalid ObjectIds and overlarge text fail safely, project-scoped queries are used, raw notes are not logged, and API responses use safe DTOs.

Suggested commit: `feat: add projects and notes workflow`

## 7. Mock Extraction Workflow

Goal: produce deterministic draft insights from synthetic notes.

Scope: mock provider and extraction run endpoint.

Out of scope: external AI calls.

Likely files: AI provider interface, mock provider, extraction service.

Verification: extraction creates draft InsightItem records.

Security notes: keep provider selection server-controlled or enum-validated, avoid logging full note content/prompts, and keep provider keys server-side.
Security verification: mock provider works without API keys, no raw prompts/responses are logged by default, and provider credentials cannot be supplied by the client.

Suggested commit: `feat(ai): add mock extraction workflow`

## 8. Extraction Schema Validation

Goal: validate provider output.

Scope: schema validation and failure handling.

Out of scope: provider expansion.

Likely files: validation helpers, tests.

Verification: invalid output fails clearly and is not saved.

Security notes: reject loose provider output and return sanitized validation errors.
Security verification: malformed provider output is rejected, raw provider errors are not exposed to UI, and raw debug payloads are omitted from default DTOs.

Suggested commit: `feat(ai): validate extraction schema`

## 9. OpenAI Provider

Goal: add optional OpenAI adapter.

Scope: provider adapter behind existing interface.

Out of scope: making OpenAI required.

Likely files: provider adapter, config, tests with mocked calls.

Verification: mock remains default; OpenAI path can be configured.

Security notes: use environment variables for keys, never expose raw provider responses to the frontend, and keep mock as the safe default.
Security verification: provider key is server-side only, `.env` is absent, `.env.example` documents config if needed, and tests/mock calls do not require real secrets.

Suggested commit: `feat(ai): add openai provider adapter`

## 10. Review/Edit/Accept Workflow

Goal: make insights human-reviewable.

Scope: UI controls and API update endpoint.

Out of scope: dashboard polish.

Likely files: insight API module and review components.

Verification: edit and status changes persist.

Security verification: update DTO allows only intended fields, insight lookup is scoped by project ID, and internal payload/raw response fields are not editable from the client.

Suggested commit: `feat: add insight review workflow`

## 11. Dashboard Aggregation

Goal: summarize accepted and draft discovery signal.

Scope: computed dashboard endpoint and UI.

Out of scope: advanced analytics.

Likely files: dashboard service and page.

Verification: dashboard reflects current InsightItem data.

Security verification: aggregation queries are scoped by project ID and dashboard DTOs do not include raw provider/debug payloads.

Suggested commit: `feat: add discovery dashboard`

## 12. Demo Seed/Reset

Goal: reset local demo data.

Scope: OnboardIQ seed scenario and reset endpoint/action.

Out of scope: production data migration.

Likely files: seed service and UI action.

Verification: reset produces predictable synthetic data.

Security verification: seed data is fictional, reset does not touch non-demo records, and no private notes or real company/person data appear in fixtures.

Suggested commit: `feat(demo): add synthetic seed reset`

## 13. Polish And README Screenshots

Goal: make the demo interview-ready.

Scope: UI polish, README updates, screenshots.

Out of scope: new core features.

Likely files: web styles/components, README assets.

Verification: screenshots match the working app.

Security verification: screenshots and README examples show synthetic data only and no secrets, private notes, or provider debug output.

Suggested commit: `docs: polish demo screenshots`

## 14. CI

Goal: add automated checks.

Scope: GitHub Actions for install, lint, typecheck, tests.

Out of scope: deployment.

Likely files: workflow files.

Verification: CI passes on pull request.

Security verification: CI does not require real provider keys, does not echo secrets, and can include basic secret/file checks.

Suggested commit: `ci: add validation workflow`

## 15. Optional Deployment

Goal: deploy the demo if useful.

Scope: simple deployment target and environment configuration.

Out of scope: enterprise hardening.

Likely files: deployment config and docs.

Verification: deployed demo health and workflow smoke pass.

Security verification: deployment uses managed secrets, production-safe logging, rate limiting plan, and auth/authorization plan before any non-demo data is handled.

Suggested commit: `chore: add optional deployment path`
