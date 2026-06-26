# Scope and Boundaries

## MVP Scope

- Project creation for a product discovery effort.
- Synthetic note intake.
- Mock AI extraction.
- Evidence-backed insight review.
- Editable review status.
- Dashboard summary.
- Demo seed/reset flow.

## Non-Goals

- Real customer data ingestion.
- Auth, billing, teams, permissions, or enterprise administration.
- External AI provider calls in the first implementation slice.
- Complex analytics, search, or collaboration features.
- Production deployment in the MVP.

## Hard Product Boundary

SignalForge is only about startup/product discovery and design-partner insight synthesis. It should stay centered on founders, product teams, venture studios, qualitative notes, insight review, pilot criteria, and next experiments.

## No Industrial Maintenance Or Troubleshooting

Do not build industrial maintenance workflows, equipment troubleshooting, machinery systems, manuals, manual search, parts search, technician copilots, CMMS features, diagnostics, field service workflows, PlantBrain overlap, or Tenzin overlap.

These terms may appear in boundary documentation like this section, but they should not appear in product entities, demo data, routes, UI labels, seed scenarios, or implementation names.

## Data Boundary

- Synthetic/demo data only.
- No real customer notes.
- No private Gitwit or Mechro information.
- No interview, recruiter, or candidate details.
- No secrets, API keys, tokens, credentials, or private connection strings.

## Security-Forward MVP Boundary

- Validate backend inputs; do not rely only on UI validation.
- Use explicit DTOs, schemas, enums, and bounded text fields when app code is introduced.
- Keep AI provider keys server-side only.
- Use environment variables for configuration that differs by environment.
- Add `.env.example` only when configuration is introduced; never add `.env`.
- Do not expose raw provider responses or internal error traces to the frontend.
- Scope data access by project ID so future workspace/user authorization can be added cleanly.
- Avoid trusting client-provided ownership fields.
- Prefer clear failure states over implementation-detail leaks.

## Security Features Out Of MVP

Do not overbuild full authentication, authorization roles, audit logging, encryption-at-rest configuration, billing security, SOC2 controls, or enterprise compliance in the MVP. Keep the architecture ready for them later.

## What Should Not Be Built Yet

- React app scaffold.
- NestJS app scaffold.
- MongoDB connection.
- Docker Compose.
- Package files or lockfiles.
- CI files.
- External AI integrations.

## Intentionally Fake Or Synthetic

- Demo notes.
- Demo companies and people.
- Mock extraction responses.
- Demo reset scenarios.

## Deferred Until Later

- OpenAI provider.
- Anthropic/Gemini adapters.
- Auth.
- Background processing.
- Deployment.
- Screenshot polish.
- CI.

## Intentional Security Tradeoff

The MVP is local-only and synthetic-data-only, so auth and role-based authorization are deferred. To keep that tradeoff reversible, future API slices should still validate inputs, avoid trusting client ownership fields, use project-scoped queries, keep secrets server-side, and return sanitized errors.
