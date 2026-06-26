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
- OpenAI provider later
- Future-ready for Anthropic and Gemini
- Docker Compose later for local MongoDB
- GitHub Actions later for CI

App scaffolding has not been added yet. There are no package files, app folders, Docker files, dependencies, or framework-generated files in this docs-first phase.

## Local Setup

Future placeholder until scaffolding exists:

1. Clone the repository.
2. Review `AGENTS.md` and the docs index below.
3. Wait for the repo/tooling scaffold slice before running install, build, or test commands.

## Demo Flow

1. Create a product discovery project.
2. Paste or load synthetic messy design-partner notes.
3. Run extraction with the mock AI provider.
4. Review evidence-backed insights.
5. Edit, accept, reject, or mark insights for follow-up.
6. View the dashboard summary.
7. Decide what to build now, what to learn more about, and what to ignore.

## Architecture Summary

The intended app is a small full-stack TypeScript monorepo: React for the product workflow, NestJS for REST APIs and orchestration, MongoDB/Mongoose for flexible discovery documents, and an AI provider abstraction that starts with deterministic mock output before external AI integration.

The intended structure is documented, not created yet.

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

## Roadmap

1. Complete docs foundation.
2. Add repo/tooling scaffold.
3. Add NestJS API shell.
4. Add MongoDB/Mongoose connection.
5. Add React app shell.
6. Implement projects and notes CRUD.
7. Implement mock extraction workflow.
8. Validate extraction schema.
9. Add OpenAI provider.
10. Add review/edit/accept workflow.
11. Add dashboard aggregation.
12. Add demo seed/reset.
13. Polish README and screenshots.
14. Add CI.
15. Optionally deploy.

## Gitwit Alignment

SignalForge is meant to show the habits Gitwit values: zero-to-one product thinking, pragmatic full-stack TypeScript delivery, AI product judgment, human-centered workflow design, and the ability to turn ambiguous discovery input into useful product decisions.
