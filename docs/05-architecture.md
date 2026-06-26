# Architecture

This document describes the intended structure only. Do not create these app folders until the relevant implementation slice.

## Target Monorepo Structure

```txt
apps/
  api/
  web/
packages/
  shared/
docs/
```

## Frontend Architecture

The future frontend should use React + TypeScript. Planned layers:

- routes/pages for product workflows
- domain components for note intake, insight review, and dashboard summaries
- API client functions grouped by resource
- TanStack Query hooks for server state
- shared domain types where useful

## Backend Architecture

The future backend should use NestJS + TypeScript. Planned layers:

- controllers for REST endpoints
- services for product workflow logic
- DTOs for request/response contracts
- Mongoose schemas/models for persistence
- provider adapters for AI extraction

Backend inputs should be validated with explicit DTOs, schemas, enums, ObjectId checks, and bounded text fields. Controllers should not accept loose request shapes.

## MongoDB/Mongoose Architecture

MongoDB stores document-shaped discovery data. Mongoose should define Project, ResearchNote, ExtractionRun, and InsightItem models. Relationships use ObjectId references.

Queries should be scoped by `projectId` even before auth exists. Avoid trusting client-provided ownership fields; derive relationships from route parameters and server-side lookups.

## AI Provider Architecture

Backend services should call an AI extraction interface. The mock adapter returns deterministic synthetic results. Future adapters can call OpenAI, Anthropic, or Gemini without changing the API contract.

Provider keys stay server-side in environment variables. Raw provider responses should be validated and normalized before persistence or frontend exposure.

## Runtime Flow

1. User creates a project.
2. User adds synthetic research notes.
3. User starts an extraction run.
4. API loads notes and calls the configured AI provider.
5. API validates the extraction result.
6. API saves draft InsightItem documents.
7. User reviews, edits, accepts, rejects, or marks follow-up.
8. Dashboard aggregates accepted and draft insight state.

## Security-Forward Architecture

- Treat raw notes, prompts, provider responses, evidence quotes, and extracted insight payloads as sensitive by design.
- Keep configuration environment-based.
- Keep AI provider keys server-side only.
- Validate backend inputs with DTOs, schemas, enums, ObjectId checks, and bounded fields.
- Sanitize API errors before returning them to the frontend.
- Avoid logging raw notes, prompts, provider responses, API keys, tokens, credentials, or internal traces.
- Scope data access by project ID on every nested resource.
- Do not trust client-provided ownership fields.
- Design service boundaries so future authentication and workspace/user authorization can be added cleanly.

## Environment Variable Plan

Future variables may include:

- `MONGODB_URI`
- `AI_PROVIDER`
- `OPENAI_API_KEY`
- provider-specific model names

No `.env` file should be committed. Add `.env.example` only when configuration is introduced.

## Logging And Error Boundaries

Application logs should avoid raw note contents, prompts, API keys, and full provider responses. Error responses should be clear but sanitized, with implementation details kept server-side.

## Why No Auth Initially

The first demo is local and synthetic. Auth would add setup cost without proving the discovery workflow. API and data access patterns should still assume auth may arrive later by scoping reads and writes through project routes and avoiding client-provided ownership shortcuts.

## Why No Queue Initially

Mock extraction should complete quickly. A queue can be added later if external provider calls or longer workflows need it.

## Intentional Security Tradeoff

The MVP defers auth, authorization roles, audit logging, encryption-at-rest configuration, and enterprise compliance. The architecture should still keep secrets server-side, validate backend input, sanitize errors, and avoid coupling demo configuration to runtime configuration.

## Future Deploy Options

Likely deploy targets are GCP Cloud Run or AWS App Runner/ECS. Deployment is deferred until the product workflow is working locally. Any future deployment target must use managed secrets, production-safe logging, rate limiting, and a real authentication/authorization plan before handling non-demo data.
