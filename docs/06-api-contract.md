# API Contract

This is the planned REST contract. No API code exists yet.

## API Security Posture

- Validate all request params, query strings, and bodies on the backend.
- Use explicit DTOs, enums, ObjectId validation, and bounded text fields.
- Scope project data access by `projectId` on every nested route.
- Do not trust client-provided ownership fields.
- Return clear, sanitized errors instead of internal traces.
- Do not expose provider secrets, raw provider responses, or internal AI errors.
- Do not expose stack traces or internal debug payloads.
- Do not log raw note contents, prompts, provider responses, or secrets by default.
- Design routes so authentication can be added later without changing resource ownership patterns.

## Health

### `GET /health`

Purpose: confirm the API is running.

Response:

```json
{ "status": "ok" }
```

MVP notes: no dependency checks required at first.

## Projects

### `GET /projects`

Purpose: list projects.

Response shape: array of project summaries.

### `POST /projects`

Purpose: create a project.

Request shape:

```json
{ "name": "OnboardIQ Discovery", "description": "Synthetic demo project" }
```

Validation: `name` is required and bounded.

### `GET /projects/:projectId`

Purpose: return project detail.

Validation: `projectId` must be a valid ObjectId.

MVP notes: future auth can filter project access at this boundary.

## Notes

### `GET /projects/:projectId/notes`

Purpose: list research notes for a project.

### `POST /projects/:projectId/notes`

Purpose: add a synthetic research note.

Request shape:

```json
{
  "title": "Design partner call notes",
  "sourceType": "design_partner_note",
  "rawText": "Messy synthetic note text..."
}
```

Validation: title, source type, and raw text are required.
DTO expectations: reject empty or overly large note text, unknown source types, and client-provided project ownership fields.

MVP notes: do not log full note content by default.

## Extraction

### `POST /projects/:projectId/extraction-runs`

Purpose: start extraction for selected notes.

Request shape:

```json
{ "researchNoteIds": ["..."], "provider": "mock" }
```

Response shape: extraction run summary with status.

MVP notes: run synchronously for the mock provider.

Validation: note IDs must belong to the route project. Provider must be an allowed enum. Do not accept provider credentials from the client.

### `GET /projects/:projectId/extraction-runs/:runId`

Purpose: inspect extraction status and errors.

MVP notes: expose normalized status and sanitized error messages only.

## Insights

### `GET /projects/:projectId/insights`

Purpose: list extracted insights with filters.

Query options: `type`, `reviewStatus`, `decisionRecommendation`.

### `PATCH /projects/:projectId/insights/:insightId`

Purpose: edit insight title, summary, tags, review status, or decision recommendation.

Validation: only allowed fields can be updated.
DTO expectations: `reviewStatus`, `confidence`, `type`, and `decisionRecommendation` use enums; free-text fields are bounded.

MVP notes: verify the insight belongs to the route project before updating.

## Dashboard

### `GET /projects/:projectId/dashboard`

Purpose: return computed summary data.

Response shape:

```json
{
  "countsByType": {},
  "topPainPoints": [],
  "recommendedExperiments": [],
  "decisionSummary": {}
}
```

MVP notes: compute from current InsightItem documents.

Validation: dashboard reads should be scoped by project ID.

## Demo Seed/Reset

### `POST /demo/reset`

Purpose: reset the local synthetic demo scenario.

Response shape: seeded project summary.

MVP notes: safe local-only behavior. No real data should be present.

Validation: reset behavior should not mix demo configuration with runtime provider configuration.
