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
- OpenAI provider later
- Leave room for Anthropic and Gemini providers later
- Docker Compose later for local MongoDB
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

## Coding Conventions

- Use TypeScript throughout future app code.
- Keep DTOs, validation, and persistence models clearly separated.
- Use clear domain names from product discovery, not industrial operations.
- Keep APIs and UI state predictable, boring, and easy to demo.
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

Future slices should include the most relevant checks for the touched surface: lint/typecheck, unit tests, API tests, UI smoke checks, or manual demo notes. If a check cannot be run, say so clearly.

## Data and Secrets

- Use synthetic/demo data only.
- Do not commit real customer notes.
- Do not commit private Gitwit, Mechro, interview, recruiter, or candidate information.
- Do not commit secrets, API keys, tokens, credentials, or private connection strings.

## Current Scaffold

This repository currently contains only Codex/agent guidance. Do not add application code, dependencies, package files, Docker files, database setup, CI files, or framework scaffolding until explicitly requested.
