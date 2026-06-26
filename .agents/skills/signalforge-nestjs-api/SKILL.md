---
name: signalforge-nestjs-api
description: Guidance for future SignalForge NestJS API work.
---

# SignalForge NestJS API

## When To Use

Use this skill when future work touches the NestJS backend, REST API contracts, validation, persistence, or service-layer behavior.

## Expected Architecture

Keep the backend modular and direct: controllers for HTTP, services for business logic, DTOs for request/response contracts, and Mongoose models for persistence. Avoid premature CQRS, event buses, or microservice patterns.

## Likely Modules

- projects or workspaces
- notes or source inputs
- extraction runs
- insights
- recommendations
- demo seed/reset support

## DTO And Validation

Use explicit DTOs for inbound and outbound API shapes. Validate required fields, enums, IDs, and bounded text inputs before service logic.

Validation belongs on the backend even when the UI validates. Avoid loose `any` request shapes.

## MongoDB/Mongoose

Use MongoDB with Mongoose when persistence is introduced. Keep schemas aligned to product discovery entities and avoid leaking raw database models directly through public responses.

Scope data access by project ID so future workspace/user authorization can be added without rewriting query patterns. Do not trust client-provided ownership fields.

## REST Style

Prefer resource-oriented endpoints such as `/projects`, `/notes`, `/extraction-runs`, and `/insights`. Return predictable JSON, stable IDs, timestamps, and clear error responses.

Sanitize errors before returning them to the frontend. Do not expose internal traces, raw provider responses, or secrets.

## Keep It Lean

Implement the smallest useful backend slice for the demo. Do not add auth, billing, queues, background workers, or complex infrastructure until explicitly requested.

Use environment variables for configuration that may differ by environment. Add `.env.example` only when configuration is introduced; never add `.env`.
