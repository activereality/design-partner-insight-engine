# Design Partner Insight Engine

Working codename: SignalForge.

SignalForge helps early-stage product teams turn messy founder, customer, and design-partner notes into structured product discovery insights, evidence-backed pilot criteria, and recommended next experiments.

## Why This Exists

Early venture teams collect useful discovery signal in scattered notes, calls, founder conversations, and design-partner feedback. The hard part is turning that raw material into crisp decisions without losing the evidence behind each claim.

SignalForge is a Gitwit-aligned portfolio/interview artifact that demonstrates product-minded full-stack engineering, AI-assisted workflow design, and disciplined scope control.

## What It Does

- Captures messy discovery notes for a product project.
- Extracts personas, user jobs, pain points, workarounds, urgency signals, buying triggers, feature hypotheses, risks, open questions, pilot success criteria, recommended experiments, and decision recommendations.
- Keeps human review in the loop before insights are accepted.
- Shows a dashboard-oriented summary of what to build now, learn more about, or ignore.
- Grounds recommendations in evidence from the supplied notes.

## Demo Data Notice

This project uses synthetic/demo data only. Do not commit real customer notes, private Gitwit or Mechro information, interview/recruiter details, secrets, API keys, tokens, or credentials.

## Security And Privacy Posture

Treat raw research notes, AI prompts, provider responses, extracted insights, and evidence quotes as sensitive by design, even when the current repo uses only synthetic data. Future deployment would require authentication, authorization, rate limiting, managed deployment secrets, and production-safe logging controls before handling real customer information.

## Stack Direction

- React + TypeScript frontend
- NestJS + TypeScript backend
- MongoDB + Mongoose persistence
- AI provider abstraction
- Mock AI provider first
- Optional OpenAI provider server-side
- Future-ready for Anthropic and Gemini
- Docker Compose for local MongoDB
- GitHub Actions later for CI

The API and frontend now support projects, notes, deterministic mock extraction, optional server-side OpenAI extraction, human review actions for generated insights, a reviewed-signal project dashboard, and gated synthetic demo seed/reset tools. Mock remains the default. Auth, deployment, and CI are still deferred.

## Local Setup

Current tooling scaffold:

1. Clone the repository.
2. Review `AGENTS.md` and the docs index below.
3. Use `pnpm` for future workspace commands.
4. Run `pnpm install` after cloning.
5. For local API development, copy `apps/api/.env.example` to `apps/api/.env` and keep `.env` uncommitted.
6. Start local MongoDB with `docker-compose up -d`.
7. API commands are available with `pnpm --filter @signalforge/api dev`, `pnpm --filter @signalforge/api build`, and `pnpm --filter @signalforge/api typecheck`.
8. The API health check is `GET http://localhost:3000/api/health`.
9. Frontend commands are available with `pnpm --filter @signalforge/web dev`, `pnpm --filter @signalforge/web build`, and `pnpm --filter @signalforge/web typecheck`.
10. The frontend runs at `http://127.0.0.1:5173` by default.
11. To use demo tools locally, set `DEMO_TOOLS_ENABLED=true` in uncommitted API environment configuration. Keep it `false` by default and never enable demo reset in production.

## Quick Local Start

Use the PowerShell helpers for local development on Windows:

```powershell
.\scripts\dev-start.ps1
```

For a seeded local demo:

```powershell
.\scripts\dev-start.ps1 -EnableDemoTools -SeedDemo
```

Check status:

```powershell
.\scripts\dev-health.ps1
```

Stop local MongoDB:

```powershell
.\scripts\dev-stop.ps1
```

Manual commands and troubleshooting are in the [Local Runbook](docs/14-local-runbook.md). Do not commit local `.env` files.

## Demo Flow

1. Enable local demo tools with `DEMO_TOOLS_ENABLED=true` in uncommitted API environment configuration.
2. Use the home-page demo controls or `POST /api/demo/seed` to create the synthetic OnboardIQ workspace.
3. Open the seeded project dashboard.
4. Review the synthetic notes, mock extraction runs, human-reviewed insights, and decision recommendation sections.
5. Use `POST /api/demo/reset` or the home-page reset control to remove only marked OnboardIQ demo records.

## Architecture Summary

The intended app is a small full-stack TypeScript monorepo: React for the product workflow, NestJS for REST APIs and orchestration, MongoDB/Mongoose for flexible discovery documents, and an AI provider abstraction that defaults to deterministic mock output. The current implementation connects to local MongoDB and supports project-scoped synthetic projects, raw research notes, validated extraction runs, generated insight items, human review status/edit flows, reviewed-signal dashboard aggregation, gated synthetic demo seed/reset, and an optional server-side OpenAI provider.

The current structure remains intentionally small and slice-based.

## Key Product Decisions

- Start docs-first so implementation slices stay aligned.
- Use synthetic data so the demo is safe to share.
- Use MongoDB/Mongoose because discovery notes and extracted insight evidence are naturally document-shaped.
- Use a mock AI provider first for reliable demos and tests.
- Keep AI outputs evidence-first and human-reviewed.
- Validate inputs on the backend with explicit DTOs, schemas, and enums.
- Keep AI provider keys server-side and use environment variables for environment-specific configuration.
- Delay auth, queues, deployment, and external AI calls until the workflow proves itself.
- Design API access around project-scoped data now so future user/workspace authorization can be added without rewriting core queries.

## Non-Goals

SignalForge is not an industrial maintenance workflow, equipment troubleshooting tool, machinery system, manual search product, parts search product, technician copilot, CMMS, diagnostics tool, field service product, PlantBrain clone, or Tenzin overlap.

It is also not intended to process real customer data in this portfolio phase.

## Docs Index

- [00 Product Brief](docs/00-product-brief.md)
- [01 Problem, Personas, Journey](docs/01-problem-personas-journey.md)
- [02 Scope and Boundaries](docs/02-scope-and-boundaries.md)
- [03 Domain Model](docs/03-domain-model.md)
- [04 AI Extraction Contract](docs/04-ai-extraction-contract.md)
- [05 Architecture](docs/05-architecture.md)
- [06 API Contract](docs/06-api-contract.md)
- [07 Frontend Plan](docs/07-frontend-plan.md)
- [08 Demo Data and Seed Plan](docs/08-demo-data-and-seed-plan.md)
- [09 Demo Script](docs/09-demo-script.md)
- [10 Build Plan](docs/10-build-plan.md)
- [11 Gitwit Talking Points](docs/11-gitwit-talking-points.md)
- [12 Decision Log](docs/12-decision-log.md)
- [13 Security and Privacy](docs/13-security-and-privacy.md)
- [14 Local Runbook](docs/14-local-runbook.md)

## Roadmap

1. Completed: docs foundation.
2. Completed: repo/tooling scaffold.
3. Completed: NestJS API shell.
4. Completed: MongoDB/Mongoose connection.
5. Completed: React app shell.
6. Completed: projects and notes CRUD.
7. Completed: mock extraction workflow.
8. Completed: extraction schema validation.
9. Completed: optional OpenAI provider.
10. Completed: review/edit/accept workflow.
11. Completed: dashboard aggregation.
12. Completed: demo seed/reset.
13. Completed: local runbook and dev scripts.
14. Polish README and screenshots.
15. Add CI.
16. Optionally deploy.

## Gitwit Alignment

SignalForge is meant to show the habits Gitwit values: zero-to-one product thinking, pragmatic full-stack TypeScript delivery, AI product judgment, human-centered workflow design, and the ability to turn ambiguous discovery input into useful product decisions.
