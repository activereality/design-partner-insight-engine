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

## MongoDB/Mongoose

Use MongoDB with Mongoose when persistence is introduced. Keep schemas aligned to product discovery entities and avoid leaking raw database models directly through public responses.

## REST Style

Prefer resource-oriented endpoints such as `/projects`, `/notes`, `/extraction-runs`, and `/insights`. Return predictable JSON, stable IDs, timestamps, and clear error responses.

## Keep It Lean

Implement the smallest useful backend slice for the demo. Do not add auth, billing, queues, background workers, or complex infrastructure until explicitly requested.
