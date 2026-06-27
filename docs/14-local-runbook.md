# Local Runbook

## Purpose

This runbook explains how to run SignalForge locally for development and interview demos. It keeps local setup repeatable while preserving the synthetic-data-only and no-secrets posture.

## Prerequisites

- Node.js
- pnpm
- Docker Desktop
- Git
- PowerShell on Windows for the helper scripts

## First-Time Setup

Install workspace dependencies:

```powershell
pnpm install
```

Create local environment files from examples:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env
```

Keep both `.env` files uncommitted. They are gitignored.

For normal local development, keep:

```txt
AI_PROVIDER=mock
DEMO_TOOLS_ENABLED=false
```

Set `DEMO_TOOLS_ENABLED=true` in `apps/api/.env` only when intentionally using local demo seed/reset tools. Do not enable demo tools in production-like environments.

## Quick Local Start

From the repo root:

```powershell
.\scripts\dev-start.ps1
```

To enable demo seed/reset tools locally:

```powershell
.\scripts\dev-start.ps1 -EnableDemoTools
```

To enable demo tools and seed the synthetic OnboardIQ demo after the API becomes healthy:

```powershell
.\scripts\dev-start.ps1 -EnableDemoTools -SeedDemo
```

The script:

- checks for Node.js, pnpm, and Docker Compose
- prefers `docker-compose` when available
- copies missing `.env.example` files to local `.env`
- keeps `AI_PROVIDER=mock`
- starts MongoDB
- starts API and web dev servers in separate PowerShell windows
- prints safe local URLs only

## Manual Run Steps

Terminal 1:

```powershell
docker-compose up -d
```

Terminal 2:

```powershell
pnpm --filter @signalforge/api dev
```

Terminal 3:

```powershell
pnpm --filter @signalforge/web dev
```

Open the web app:

```txt
http://127.0.0.1:5173
```

## Health Checks

API:

```powershell
Invoke-RestMethod http://localhost:3000/api/health
```

Web:

```txt
http://127.0.0.1:5173
```

Scripted status:

```powershell
.\scripts\dev-health.ps1
```

## Demo Seed

If demo tools are enabled, seed from the home-page demo controls or run:

```powershell
Invoke-RestMethod -Method Post http://localhost:3000/api/demo/seed
```

The seeded project is fully synthetic OnboardIQ demo data. It does not require OpenAI keys and does not call real AI providers.

## Demo Reset

If demo tools are enabled, reset from the home-page demo controls or run:

```powershell
Invoke-RestMethod -Method Post http://localhost:3000/api/demo/reset
```

Reset deletes only records marked as OnboardIQ demo data. It does not delete arbitrary projects, notes, extraction runs, or insights.

## Stop Local Services

Stop MongoDB:

```powershell
.\scripts\dev-stop.ps1
```

Close API and web dev windows with `Ctrl+C`.

To remove the local MongoDB volume for this repo, use the explicit volume switch:

```powershell
.\scripts\dev-stop.ps1 -RemoveVolumes
```

This deletes local MongoDB data for the repo, including synthetic demo data. It is not the default.

## Troubleshooting

### API Fails Because `.env` Is Missing

Copy the example file:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
```

Confirm the file stays uncommitted.

### MongoDB Is Not Running

Start MongoDB:

```powershell
docker-compose up -d
```

Then rerun the API.

### MongoDB Volume Has Old Credentials

If local credentials changed, the existing Docker volume may still contain old credentials. Stop the stack and remove only the local repo volume:

```powershell
.\scripts\dev-stop.ps1 -RemoveVolumes
docker-compose up -d
```

This deletes local MongoDB data for this repo.

### `docker compose` Versus `docker-compose`

On this Windows machine, `docker-compose` has been the more reliable command in shells/tools. The scripts prefer `docker-compose` when available and fall back to `docker compose`.

### Port 3000 Or 5173 Already In Use

Close old API/web dev windows or stop the process using the port. Then rerun the start command.

### pnpm Missing Or Node Version Too Old

Install a current Node.js version and pnpm, then rerun:

```powershell
pnpm install
```

## Safety Checklist

- Do not commit `.env`.
- Use synthetic/demo data only.
- Keep `AI_PROVIDER=mock` unless intentionally testing OpenAI locally.
- Never put OpenAI keys in frontend env.
- Never commit API keys, tokens, credentials, private notes, recruiter/interview content, or real customer data.
- Do not paste real customer notes into the local demo.
- Keep `DEMO_TOOLS_ENABLED=false` unless intentionally seeding/resetting local demo data.
