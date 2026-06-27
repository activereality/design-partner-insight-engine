# Decision Log

## ADR 001: Public Name And Codename

Decision: use Design Partner Insight Engine as the public project name and SignalForge as the working codename.

Rationale: the public name is explicit for portfolio readers, while the codename gives the project a concise internal identity.

## ADR 002: React + TypeScript Frontend

Decision: use React + TypeScript for the future frontend.

Rationale: it is a strong fit for a product workflow demo with typed API contracts and reusable review components.

## ADR 003: NestJS + TypeScript Backend

Decision: use NestJS + TypeScript for the future backend.

Rationale: it provides clear module, controller, service, DTO, and validation patterns for a portfolio-quality API.

## ADR 004: MongoDB + Mongoose

Decision: use MongoDB + Mongoose for persistence.

Rationale: discovery notes, evidence snippets, draft insights, and evolving extraction metadata are document-shaped.

## ADR 005: AI Provider Abstraction

Decision: place AI calls behind a provider interface.

Rationale: the app can support mock output first, OpenAI later, and Anthropic/Gemini when useful without changing product workflow code.

## ADR 006: Mock AI First

Decision: build the mock provider before external providers.

Rationale: deterministic synthetic output makes demos, tests, and UI development reliable.

## ADR 007: OpenAI Later

Decision: add OpenAI after the mock workflow, schema validation, and review loop are working.

Rationale: provider integration should not obscure the core product experience.

## ADR 008: Synthetic Demo Data Only

Decision: use synthetic/demo data only.

Rationale: the artifact should be safe to share and must not expose private notes, customer data, interviews, recruiter content, secrets, API keys, tokens, or credentials.

## ADR 009: No Auth In MVP

Decision: omit auth from the MVP.

Rationale: the first version is a local portfolio demo with synthetic data. Auth can wait until there is a real multi-user need.

## ADR 010: No Queue In MVP

Decision: omit background queues from the MVP.

Rationale: mock extraction can run synchronously. A queue can be added later if provider calls become slow or asynchronous.

## ADR 011: No Industrial Maintenance Or Troubleshooting Scope

Decision: exclude industrial maintenance workflows, equipment troubleshooting, machinery, manuals, manual search, parts search, technician copilots, CMMS, diagnostics, field service, PlantBrain overlap, and Tenzin overlap.

Rationale: SignalForge must stay focused on startup/product discovery and design-partner insight synthesis.

## ADR 012: Security-Forward Local MVP

Decision: build local-only slices with future deployment readiness in mind, without adding full authentication, authorization roles, audit logging, encryption-at-rest configuration, billing security, SOC2 controls, or enterprise compliance in the MVP.

Rationale: the artifact should stay small and demoable, but avoid shortcuts that would make deployment harder later.

Consequences:

- Backend input validation is required even when the UI validates.
- DTOs, schemas, enums, and bounded fields are preferred over loose shapes.
- Data access should be scoped by project ID.
- Client-provided ownership fields should not be trusted.
- Secrets and provider keys stay server-side in environment variables.
- `.env.example` is added only when configuration is introduced; `.env` is never committed.
- Errors returned to the frontend are sanitized.
- Raw notes, prompts, API keys, and full AI responses are not logged by default.

## ADR 013: Security-Forward Docs-First Approach

Decision: document security and privacy expectations before application scaffolding.

Rationale: early data and API decisions are cheaper to shape now than to retrofit later.

## ADR 014: Dedicated Security/Privacy Doc

Decision: maintain a dedicated `docs/13-security-and-privacy.md` document.

Rationale: future implementation prompts need a single practical reference for data sensitivity, logging, validation, frontend/backend boundaries, and MVP security tradeoffs.

## ADR 015: Raw Notes Are Sensitive By Design

Decision: treat `ResearchNote.rawText` as sensitive even when the current repo contains only synthetic data.

Rationale: the same field could later hold customer discovery input, so logging, API responses, and access patterns should be designed carefully from the start.

## ADR 016: Insight Evidence Is Potentially Sensitive

Decision: treat `InsightItem.evidence` and source-derived insight payloads as potentially sensitive.

Rationale: evidence quotes can contain raw-note language and product context, so embedding evidence in MVP insight documents makes those documents source-derived records.

## ADR 017: Demo Seed Data Fully Synthetic

Decision: demo seed data and committed mock output must be fully synthetic.

Rationale: the public repo should stay safe to share and should not contain real people, companies, employers, customer notes, recruiter messages, interview notes, or private company details.

## ADR 018: AI Provider Keys Stay Server-Side

Decision: keep AI provider keys and provider-specific configuration server-side only.

Rationale: frontend exposure would make secrets difficult to protect and rotate.

## ADR 019: No Auth In MVP, Project-Scoped Access Now

Decision: defer auth in the MVP but design data access around project-scoped routes and queries.

Rationale: project scoping creates a clean boundary for future workspace/user authorization without requiring a rewrite.

## ADR 020: No Raw Provider Responses To Frontend

Decision: raw provider responses and internal debug payloads should not be exposed to frontend responses by default.

Rationale: provider responses may contain sensitive source data, prompts, or implementation details.

## ADR 021: Safe Logging Policy

Decision: avoid logging raw notes, prompts, provider responses, API keys, tokens, credentials, and internal traces by default.

Rationale: logs are easy to over-share during demos and deployment, so they should contain safe metadata unless local synthetic debugging is intentionally enabled.

## ADR 022: pnpm Workspaces For Monorepo Tooling

Decision: use pnpm workspaces for the SignalForge monorepo scaffold.

Rationale: pnpm gives the project a lightweight workspace structure for future React, NestJS, and shared TypeScript packages without installing application dependencies before they are needed.

Consequences:

- Root scripts remain safe placeholders until app packages exist.
- `apps/api`, `apps/web`, and `packages/shared` are tracked with README placeholders only.
- No React, NestJS, MongoDB, Mongoose, AI provider, Docker, or test framework dependencies were introduced by the repo/tooling scaffold slice.

## ADR 023: Minimal NestJS API Shell First

Decision: add a minimal NestJS API shell with a global `/api` prefix, `GET /api/health`, validation-friendly defaults, and no product/domain modules.

Rationale: the backend needs a verifiable shell before MongoDB, domain workflows, AI providers, or frontend integration are introduced.

Consequences:

- NestJS runtime dependencies are introduced for the API workspace.
- MongoDB, Mongoose, provider packages, auth, seed data, and product endpoints remain deferred.
- The API can establish safe defaults for future DTO validation and sanitized responses without implementing product logic.

## ADR 024: Docker Compose For Local MongoDB

Decision: use root-level Docker Compose for local MongoDB during development.

Rationale: a local MongoDB service gives the API a repeatable infrastructure dependency without adding production deployment configuration.

Consequences:

- Local credentials are documented as development-only placeholders.
- `.env.example` documents `MONGODB_URI`, but `.env` remains uncommitted.
- Product schemas, seed data, and domain modules remain deferred.

## ADR 025: Validate API Environment At Startup

Decision: validate `PORT`, `NODE_ENV`, and `MONGODB_URI` during API startup.

Rationale: missing or malformed configuration should fail clearly before the API starts serving requests, without logging raw connection strings or secrets.

## ADR 026: Vite React Shell With React Router

Decision: use Vite + React + TypeScript with React Router for the initial web shell.

Rationale: this gives SignalForge a small, fast frontend foundation for future product workflows without adding a heavy design system or state/data-fetching stack before it is needed.

Consequences:

- The frontend has `/` and `/projects` routes only.
- The health check uses a direct `fetch` and safe display fields; TanStack Query remains deferred.
- Frontend configuration is limited to public-safe `VITE_*` values.

## ADR 027: Project-Scoped Projects And Notes Foundation

Decision: implement projects and raw research notes as the first product-domain workflow, with notes created and listed through project-scoped routes.

Rationale: projects and notes are the smallest useful discovery workflow and establish the future authorization boundary before AI extraction or dashboards are added.

Consequences:

- Project and note inputs use explicit DTOs, enums, ObjectId validation, and bounded text fields.
- `ResearchNote.rawText` is returned only for the note workflow and remains treated as sensitive by design.
- Clients do not provide note ownership or project scope fields during note creation.
- AI extraction, insights, dashboard aggregation, auth, seed/reset, and provider code were deferred to later slices.

## ADR 028: Deterministic Mock Extraction Workflow

Decision: implement the first extraction workflow with a deterministic mock extractor only.

Rationale: mock extraction proves the end-to-end product loop without network access, provider packages, API keys, paid calls, or provider-specific failure modes.

Consequences:

- `POST /api/notes/:noteId/extract` derives `projectId` from the note server-side.
- Extraction runs persist provider `mock`, model `mock-design-partner-extractor`, prompt/schema versions, status, and safe metadata.
- Mock `rawResponse` stores deterministic metadata only and does not store raw note text.
- Generated insights are first persisted with `reviewStatus: ai_generated`; human review actions can later accept, reject, edit, or mark them as needing follow-up.
- Insight API responses omit internal `payload`; evidence snippets remain potentially sensitive and should be handled carefully.
- OpenAI provider integration and dashboard aggregation were deferred to later slices; Anthropic/Gemini providers, auth, and seed/reset remain deferred.

## ADR 029: Validate Extraction Output Before Persistence

Decision: define `design_partner_extraction.v1` as a backend-local runtime contract and validate extraction output before creating `InsightItem` records.

Rationale: provider output is untrusted, even from a deterministic mock. Validating the full extraction shape early prevents malformed insights from becoming persisted product data.

Consequences:

- `schemaVersion`, `promptVersion`, and the mock model name are code constants.
- Mock extraction returns a full `DesignPartnerExtraction` object instead of ad hoc insight drafts.
- The extraction service parses output before mapping it into persisted insight records.
- Validation failures mark the extraction run failed with safe metadata and do not expose raw output, payloads, stack traces, or raw note text.
- Focused Node tests cover valid parsing, invalid parsing, and mapping validated output into persistable insight drafts.

## ADR 030: Provider Abstraction With Mock Default And Optional OpenAI

Decision: route extraction through a provider abstraction with mock as the default provider and OpenAI as an optional server-side provider.

Rationale: the product can demonstrate deterministic extraction locally without keys while leaving a clean path to real provider calls when configured.

Consequences:

- `AI_PROVIDER` defaults to `mock`.
- `OPENAI_API_KEY` and `OPENAI_MODEL` are required only when `AI_PROVIDER=openai`.
- The OpenAI provider uses the official Node SDK and Responses API structured output path.
- Provider output is validated against `design_partner_extraction.v1` before persistence.
- OpenAI keys, prompts, raw provider responses, provider errors, and internal debug payloads are not exposed to the frontend.
- Normal extraction run responses omit full raw provider responses, and insight responses continue to omit internal `payload`.
- Anthropic/Gemini providers, streaming, dashboard, auth, and seed/reset remain deferred.

## ADR 031: Human Review Before Insight Acceptance

Decision: keep generated insights in `ai_generated` status until a human reviewer accepts, rejects, edits, or marks them as needing follow-up.

Rationale: SignalForge should demonstrate AI-assisted discovery synthesis without pretending generated output is automatically correct.

Consequences:

- Review actions are explicit API calls and persist `reviewedAt`.
- Editing is limited to bounded human-review fields and preserves generated originals internally.
- No fake reviewer identity is recorded while auth/user accounts are out of scope.
- The client cannot edit internal `payload`, evidence, extraction metadata, project scope, note scope, provider details, or raw provider output.
- Insight responses continue to omit internal `payload`; extraction run responses continue to omit `rawResponse`.
- Review workflow remained project/discovery-focused and did not itself add dashboard aggregation, auth, seed/reset, audit logging, or provider comparison behavior.

## ADR 032: Dashboard Summarizes Reviewed Signal

Decision: aggregate the project dashboard from current project-scoped insights, treating accepted and edited insights as primary signal while keeping needs-follow-up and unreviewed AI-generated insights separate.

Rationale: the dashboard should support product decisions without presenting raw AI output as final authority.

Consequences:

- Rejected insights are counted but excluded from primary recommendation sections.
- Unreviewed `ai_generated` insights are counted as draft signal, not shown as final dashboard recommendations.
- Decision recommendation buckets are derived server-side from persisted insight metadata and returned as safe DTOs.
- Dashboard responses omit internal `payload`, extraction `rawResponse`, full note `rawText`, raw provider output, provider details, and secrets.
- The dashboard remains a current-state view; historical snapshots, exports, audit logs, auth roles, and advanced analytics remain out of scope.
