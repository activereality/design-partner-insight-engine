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

Status: completed as minimal API shell only.

Goal: create the backend shell.

Scope: NestJS app, global `/api` prefix, health endpoint, safe validation defaults, package scripts.

Out of scope: database and AI behavior.

Likely files: `apps/api/*`.

Verification: API starts and `GET /api/health` returns ok.

Security notes: add global validation plumbing early; return sanitized errors.
Security verification: validation is enabled, health response exposes no config/secrets, and error responses do not include stack traces in normal mode.

Suggested commit: `feat(api): add nestjs shell`

## 4. MongoDB/Mongoose Connection

Status: completed as local infrastructure and connection health only.

Goal: connect the API to MongoDB.

Scope: Docker Compose for local MongoDB, environment validation, Mongoose connection, and safe health status.

Out of scope: full CRUD, product schemas, seed data, and product/domain modules.

Likely files: `docker-compose.yml`, API config, `AppModule`, health endpoint, API README.

Verification: `docker compose up -d` starts MongoDB, API starts with local `.env`, and `GET /api/health` returns safe API and DB status.

Security notes: read connection config from environment variables and keep `.env` uncommitted.
Security verification: `.env.example` documents required variables if introduced, `.env` is absent, and connection strings are not hard-coded.

Suggested commit: `feat(api): add mongodb mongoose connection`

## 5. React App Shell

Status: completed as minimal frontend shell only.

Goal: create the frontend shell.

Scope: Vite React + TypeScript app, React Router, basic layout, home route, projects placeholder route, and safe API health display.

Out of scope: complete UI workflow, project CRUD, notes UI, insight review, dashboard, auth, AI extraction UI, demo seed/reset, and TanStack Query.

Likely files: `apps/web/*`.

Verification: web app starts, `/` loads, `/projects` loads, and API health status renders safe fields when the backend is running.

Security verification: no provider keys or server-only config appear in frontend code or bundled environment variables.

Suggested commit: `feat(web): add react app shell`

## 6. Projects And Notes CRUD

Status: completed as the first product-domain workflow foundation.

Goal: create and view projects and notes.

Scope: project and note Mongoose schemas, DTOs, REST endpoints, route param validation, and UI forms/lists/detail views.

Out of scope: AI extraction, extraction runs, insight items, dashboard aggregation, auth, seed/reset, file upload, transcription, and search.

Likely files: API project/note modules, web project/note pages.

Verification: create/list/read/update flows work with synthetic data, and note delete is available through the API.

Security notes: validate DTOs on the backend, scope reads/writes by project ID, and do not trust client-provided ownership fields.
Security verification: invalid ObjectIds and overlarge text fail safely, project-scoped queries are used, raw notes are not logged, and API responses use safe DTOs.

Suggested commit: `feat: add projects and notes workflow`

## 7. Mock Extraction Workflow

Status: completed as deterministic local mock extraction only.

Goal: produce deterministic draft insights from synthetic notes.

Scope: extraction run persistence, insight item persistence, mock extractor service, extraction endpoint, insight read endpoints, and note-detail UI for running/displaying mock extraction.

Out of scope: external AI calls, provider packages, review/edit/accept workflow, dashboard aggregation, demo seed/reset, auth, file upload, transcription, and search.

Likely files: extraction run module, insights module, mock extractor, API clients, note detail page.

Verification: extraction creates draft `InsightItem` records and a succeeded `ExtractionRun` from a note.

Security notes: keep provider selection server-controlled or enum-validated, avoid logging full note content/prompts, and keep provider keys server-side.
Security verification: mock provider works without API keys, note list responses still exclude full `rawText`, no raw prompts/responses are logged by default, raw note text is not stored in extraction `rawResponse`, and provider credentials cannot be supplied by the client.

Suggested commit: `feat(ai): add mock extraction workflow`

## 8. Extraction Schema Validation

Status: completed for the mock provider with a backend-local runtime parser.

Goal: validate provider output.

Scope: versioned extraction contract constants/types, runtime validation, mock output shaped to `design_partner_extraction.v1`, schema-to-insight mapping, and focused validation tests.

Out of scope: provider expansion.

Likely files: extraction contract, validation helper/parser, mock extractor, extraction service, tests.

Verification: valid mock output validates, invalid output fails validation, and persisted insights are mapped only from validated output.

Security notes: reject loose provider output and return sanitized validation errors.
Security verification: malformed provider output is rejected, raw provider errors are not exposed to UI, and raw debug payloads are omitted from default DTOs.

Suggested commit: `feat(ai): validate extraction schema`

## 9. OpenAI Provider

Status: completed as an optional server-side provider behind the extraction provider abstraction.

Goal: add optional OpenAI adapter.

Scope: provider interface, mock provider wrapper, OpenAI provider using the official SDK and Responses API, environment validation, provider selection, tests for mock default and OpenAI config gating, and provider-neutral UI copy.

Out of scope: making OpenAI required, Anthropic/Gemini providers, streaming, retries/backoff, provider comparison UI, dashboard, review workflow, auth, and seed/reset.

Likely files: provider adapter, config, tests with mocked calls.

Verification: mock remains default; OpenAI path can be configured with server-side env vars; tests pass without `OPENAI_API_KEY`.

Security notes: use environment variables for keys, never expose raw provider responses to the frontend, and keep mock as the safe default.
Security verification: provider key is server-side only, `.env` is absent, `.env.example` documents safe placeholders, tests/mock calls do not require real secrets, and normal responses omit raw provider responses/internal payloads.

Suggested commit: `feat(ai): add openai provider adapter`

## 10. Review/Edit/Accept Workflow

Status: completed as the first human-in-the-loop insight review workflow.

Goal: make insights human-reviewable.

Scope: insight review status endpoints, bounded insight edit DTO, persisted review metadata, note-detail review controls, inline edit form, and safe review status display.

Out of scope: dashboard aggregation, auth, audit logging, seed/reset, provider comparison UI, and changing extraction behavior.

Likely files: insight API module, insight DTO/schema/response mapper, web extraction API client, note detail review components, README/docs updates.

Verification: edit and status changes persist; accepted, rejected, needs-follow-up, and edited states render in the note detail workflow.

Security notes: keep review actions metadata-only, do not log review edits or evidence, and continue omitting internal `payload` and extraction `rawResponse` from normal responses.
Security verification: update DTO allows only intended fields, review endpoints do not accept ownership/project scope fields, internal payload/raw response fields are not editable from the client, and insight responses still omit `payload`.

Suggested commit: `feat: add insight review workflow`

## 11. Dashboard Aggregation

Status: completed as a reviewed-signal product dashboard.

Goal: summarize reviewed discovery signal into product-decision views.

Scope: project-scoped dashboard endpoint, pure aggregation rules, reviewed-signal counts, decision recommendation buckets, note-count context, and `/projects/:projectId` dashboard UI.

Out of scope: advanced analytics, charting libraries, historical snapshots, exports, audit logs, auth, seed/reset, deployment, and CI.

Likely files: dashboard service/controller/module, dashboard aggregation helper, dashboard API client, project detail page, docs/readmes.

Verification: dashboard reflects current `InsightItem` review statuses, accepted/edited insights appear as primary signal, needs-follow-up appears separately, rejected insights are excluded from primary recommendations, and unreviewed AI-generated insights are not presented as final decisions.

Security notes: dashboard responses must stay project-scoped and compact. Internal `payload`, extraction `rawResponse`, full note `rawText`, provider details, and raw provider output remain server-side.
Security verification: aggregation queries are scoped by project ID, route params are validated, dashboard DTOs omit raw provider/debug payloads and full note text, and frontend errors remain generic.

Suggested commit: `feat: add discovery dashboard`

## 12. Demo Seed/Reset

Status: completed as gated synthetic OnboardIQ demo tooling.

Goal: reset local demo data.

Scope: OnboardIQ seed scenario, `POST /api/demo/seed`, `POST /api/demo/reset`, `DEMO_TOOLS_ENABLED` gate, marked demo-data reset safety, deterministic mock extraction records, reviewed insight states, and home-page demo controls.

Out of scope: production data migration, auth, multi-user demo data, CI, deployment, real provider calls during seed, analytics, screenshots, export/reporting, and audit logs.

Likely files: demo module/service/controller, demo fixture data, project demo markers, home-page demo controls, README/docs updates.

Verification: disabled endpoints fail safely, enabled seed creates one deterministic OnboardIQ project with 3 notes and dashboard-ready reviewed signal, re-running seed does not create duplicate demo projects, and reset removes only marked demo data.

Security notes: demo tools are disabled by default, blocked in production, synthetic-only, and never call real AI providers.
Security verification: seed data is fictional, reset does not touch non-demo records, no private notes or real company/person data appear in fixtures, no `.env` is committed, and dashboard/note responses still omit sensitive internal fields.

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
