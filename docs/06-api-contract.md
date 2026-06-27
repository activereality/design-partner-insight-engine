# API Contract

This is the REST contract for the current and planned API surface.

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

### `GET /api/health`

Purpose: confirm the API is running.

Response:

```json
{
  "status": "ok",
  "service": "signalforge-api",
  "database": "connected"
}
```

MVP notes: return safe dependency status only.

## Projects

### `GET /api/projects`

Purpose: list projects.

Response shape: array of project summaries.

### `POST /api/projects`

Purpose: create a project.

Request shape:

```json
{ "name": "OnboardIQ Discovery", "description": "Synthetic demo project" }
```

Validation: `name` is required and bounded.

### `GET /api/projects/:projectId`

Purpose: return project detail.

Validation: `projectId` must be a valid ObjectId.

MVP notes: future auth can filter project access at this boundary.

## Notes

### `GET /api/projects/:projectId/notes`

Purpose: list research notes for a project.

Response shape: array of note summaries. Summaries must not include full `rawText`; they may include a short `rawTextPreview` capped to a safe length.

### `POST /api/projects/:projectId/notes`

Purpose: add a synthetic research note.

Request shape:

```json
{
  "title": "Design partner call notes",
  "sourceType": "design_partner_call",
  "rawText": "Messy synthetic note text..."
}
```

Validation: title, source type, and raw text are required.
DTO expectations: reject empty or overly large note text, unknown source types, and client-provided project ownership fields.
Response shape: note summary without full `rawText`.

MVP notes: do not log full note content by default.

### `GET /api/notes/:noteId`

Purpose: return research note detail for viewing/editing.

Response shape: note detail including full `rawText`.

### `PATCH /api/notes/:noteId`

Purpose: update research note metadata or raw text.

Response shape: note detail including full `rawText`, because the edit workflow needs the saved value.

### `DELETE /api/notes/:noteId`

Purpose: delete a research note without deleting its project.

## Extraction

### `POST /api/notes/:noteId/extract`

Purpose: start extraction for one research note.

Response shape: extraction run summary with status.

MVP notes: derive `projectId` from the note server-side and run synchronously for the mock provider.

Validation: `noteId` must be a valid ObjectId. Do not accept provider credentials from the client.

### `GET /api/extraction-runs/:runId`

Purpose: inspect extraction status and errors.

MVP notes: expose normalized status and sanitized error messages only. Do not expose `rawResponse`.

## Insights

### `GET /api/projects/:projectId/insights`

Purpose: list extracted insights with filters.

Response shape: array of insight DTOs without internal `payload`.

### `GET /api/notes/:noteId/insights`

Purpose: list extracted insights for one note.

Response shape: array of insight DTOs without internal `payload`.

### `GET /api/insights/:insightId`

Purpose: return one insight.

Response shape: insight DTO without internal `payload`.

### `PATCH /api/insights/:insightId`

Purpose: edit human-reviewable insight fields.

Request shape:

```json
{
  "title": "Edited insight title",
  "summary": "Edited insight summary",
  "reviewNotes": "Optional reviewer note"
}
```

Validation: only allowed fields can be updated.
DTO expectations: `title`, `summary`, and `reviewNotes` are bounded free-text fields. The client cannot edit `payload`, evidence, extraction metadata, project scope, note scope, provider details, or raw provider output.

MVP notes: editing title or summary marks a non-final insight as `edited` and preserves generated originals server-side.

### `POST /api/insights/:insightId/accept`

Purpose: mark an insight accepted by a human reviewer.

Response shape: updated insight DTO with `reviewStatus: "accepted"` and `reviewedAt`.

### `POST /api/insights/:insightId/reject`

Purpose: mark an insight rejected by a human reviewer.

Response shape: updated insight DTO with `reviewStatus: "rejected"` and `reviewedAt`.

### `POST /api/insights/:insightId/needs-follow-up`

Purpose: mark an insight as needing more discovery before acceptance.

Response shape: updated insight DTO with `reviewStatus: "needs_follow_up"` and `reviewedAt`.

## Dashboard

### `GET /api/projects/:projectId/dashboard`

Purpose: return computed summary data.

Response shape:

```json
{
  "project": {},
  "noteCount": 3,
  "insightCount": 12,
  "countsByType": {},
  "countsByReviewStatus": {},
  "primarySignalCount": 5,
  "unresolvedSignalCount": 2,
  "unreviewedSignalCount": 4,
  "rejectedSignalCount": 1,
  "strongestPainPoints": [],
  "topPersonas": [],
  "topUserJobs": [],
  "featureHypotheses": [],
  "risks": [],
  "openQuestions": [],
  "pilotSuccessCriteria": [],
  "recommendedExperiments": [],
  "needsFollowUp": [],
  "decisionRecommendations": {
    "buildNow": [],
    "learnMore": [],
    "ignoreForNow": []
  }
}
```

MVP notes: compute from current `InsightItem` documents. Accepted and edited insights are primary signal. Needs-follow-up insights are unresolved signal. AI-generated insights are unreviewed signal. Rejected insights are counted but excluded from primary recommendations.

Validation: dashboard reads must validate `projectId` and scope all queries by project ID. Dashboard DTOs must omit full note `rawText`, internal insight `payload`, extraction `rawResponse`, raw provider output, provider details, and secrets.

## Demo Seed/Reset

### `POST /api/demo/reset`

Purpose: reset the local synthetic demo scenario.

Response shape: seeded project summary.

MVP notes: safe local-only behavior. No real data should be present.

Validation: reset behavior should not mix demo configuration with runtime provider configuration.
