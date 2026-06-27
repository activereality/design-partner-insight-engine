# SignalForge Agent Guide

SignalForge is the working codename for the Design Partner Insight Engine, a Gitwit-aligned portfolio/interview artifact focused on startup/product discovery and design-partner insight synthesis.

Use repo-local Codex skills from `.agents/skills`.

## Project Purpose

SignalForge turns messy founder, customer, and design-partner notes into structured product discovery insights:

- personas
- user jobs
- pain points
- workarounds
- urgency signals
- buying triggers
- feature hypotheses
- risks
- open questions
- pilot success criteria
- recommended experiments
- build now / learn more / ignore recommendations

## Stack Direction

- React + TypeScript frontend
- NestJS + TypeScript backend
- MongoDB + Mongoose persistence
- AI provider abstraction
- Mock AI provider first
- Optional OpenAI provider server-side
- Leave room for Anthropic and Gemini providers later
- Docker Compose for local MongoDB
- GitHub Actions later for CI

## Product Boundary

This project is about startup/product discovery and design-partner insight synthesis only.

Do not introduce industrial maintenance workflows, equipment troubleshooting, machinery, manuals, parts/manual search, technician copilots, CMMS, diagnostics, field service, PlantBrain, or Tenzin overlap.

## Implementation Philosophy

- Keep implementation slices small, reviewable, and portfolio-quality.
- Prefer simple, explicit architecture over clever abstractions.
- Build the mock/demo path before integrating paid or external AI services.
- Make outputs traceable to supplied notes and evidence.
- Avoid speculative product claims that are not grounded in input data.
- Build local-only slices with future deployment readiness in mind.
- Document intentional security tradeoffs instead of hiding them.

## Coding Conventions

- Use TypeScript throughout future app code.
- Keep DTOs, validation, and persistence models clearly separated.
- Validate backend inputs with explicit DTOs, schemas, enums, and bounded fields.
- Use clear domain names from product discovery, not industrial operations.
- Keep APIs and UI state predictable, boring, and easy to demo.
- Scope data access by project ID so future workspace/user authorization can be added cleanly.
- Do not trust client-provided ownership or runtime configuration fields.
- Add tests with implementation slices when behavior is non-trivial.

## Docs-First Workflow

Before implementing a meaningful slice, update or create the relevant product/API/UI/AI notes so the intended behavior is explicit. Docs should stay practical, concise, and product-minded.

## Small-Slice Workflow

For future implementation work:

1. Confirm the product slice and boundary.
2. Update docs or notes first.
3. Implement the smallest useful vertical slice.
4. Add focused verification.
5. Summarize what changed and what remains intentionally deferred.

## Verification Expectations

Future slices should include the most relevant checks for the touched surface: lint/typecheck, unit tests, API tests, UI smoke checks, or hands-on demo notes. If a check cannot be run, say so clearly.

## Data and Secrets

- Use synthetic/demo data only.
- Do not commit real customer notes.
- Do not commit private Gitwit, Mechro, interview, recruiter, or candidate information.
- Do not commit secrets, API keys, tokens, credentials, or private connection strings.
- Use environment variables for environment-specific configuration.
- Add `.env.example` only when configuration is introduced; never add `.env`.
- Keep AI provider keys server-side only.
- Do not expose provider secrets, raw provider responses, or internal error traces to the frontend.
- Avoid logging raw note contents, AI prompts, API keys, or full AI responses unless the data is clearly synthetic and the log is intentionally scoped for local debugging.

## Current Scaffold

This repository currently contains docs, repo-local Codex/agent guidance, root pnpm workspace tooling, shared TypeScript config, a NestJS API with MongoDB/Mongoose, projects/notes CRUD, validated extraction, generated insight records, mock-default provider selection, optional server-side OpenAI extraction, human review/edit/accept/reject/follow-up workflow, a project dashboard aggregation endpoint, gated synthetic demo seed/reset tools, and a Vite React frontend with projects/notes/extraction/review/dashboard/demo screens. Do not add Anthropic/Gemini providers, CI files, auth, deployment, or real customer data until explicitly requested.
