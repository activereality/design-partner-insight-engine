# Demo Data And Seed Plan

## Synthetic Data Rules

- Seed data must be fully synthetic.
- Use invented product scenarios, roles, and notes only.
- Keep all demo notes generic, fictional, and non-sensitive.
- Do not include real people, real companies, real employers, private recruiter messages, Gitwit/Mechro details, copied customer notes, interview notes, secrets, API keys, tokens, or credentials.
- Avoid industrial maintenance, equipment troubleshooting, machinery, manuals, manual search, parts search, technician copilots, CMMS, diagnostics, field service, PlantBrain, or Tenzin overlap.

## Demo Project

Project: OnboardIQ.

Concept: helping small B2B service teams turn messy customer onboarding notes into clear setup checklists.

Demo marker:

- `isDemo: true`
- `demoKey: "onboardiq"`

These markers are required so reset can delete only known demo data.

## Seeded Notes

The seed creates 3 synthetic design-partner notes:

- operations lead at a small agency
- customer success manager at a small SaaS company
- founder of a boutique consulting firm

The notes include generic product-discovery signal:

- onboarding pain
- repeated follow-up messages
- spreadsheet/checklist workarounds
- unclear ownership
- urgency and buying-trigger moments
- one weak signal about staying with spreadsheets
- pilot success criteria

## Seeded Extraction And Review State

The seed creates deterministic mock extraction runs and insight records without calling real AI providers.

Seeded insight statuses include:

- `accepted`
- `edited`
- `needs_follow_up`
- `rejected`
- `ai_generated`

The dashboard should be useful immediately after seeding: accepted and edited insights become primary signal, needs-follow-up insights remain unresolved, rejected insights are excluded from primary recommendation sections, and unreviewed AI-generated insights stay separate.

## Demo Endpoints

- `POST /api/demo/seed`
- `POST /api/demo/reset`

Both endpoints require:

- `DEMO_TOOLS_ENABLED=true`
- `NODE_ENV` not equal to `production`

If disabled, endpoints fail safely with a sanitized response.

## Reset Behavior

Reset deletes only records tied to the marked OnboardIQ demo project. It does not wipe entire collections and does not delete arbitrary user-created projects, notes, extraction runs, or insights.

Seed runs reset first, then recreates a clean deterministic state. Re-running seed should not create duplicate demo projects.

## Provider And Secret Rules

Demo reset must not require secrets, API keys, external provider calls, or network access. It should work with the mock extraction path and safe committed fixtures.

Mock output and seeded records should be safe to commit. Real AI-generated outputs should not be committed unless generated only from synthetic notes and reviewed for accidental sensitive content.
