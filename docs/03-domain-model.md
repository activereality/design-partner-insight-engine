# Domain Model

This model uses MongoDB/Mongoose document language. It is a planned model, not an implemented schema.

## Project

Represents one product discovery effort.

Fields:

- `_id`: ObjectId
- `name`: string
- `codename`: optional string
- `description`: optional string
- `status`: `active | archived | demo`
- `createdAt`: Date
- `updatedAt`: Date

## ResearchNote

Represents raw synthetic discovery input. Treat note text as sensitive by design.

Fields:

- `_id`: ObjectId
- `projectId`: ObjectId reference to Project
- `title`: string
- `sourceType`: `founder_note | customer_call | design_partner_note | synthesis_note`
- `rawText`: string, sensitive
- `tags`: string[]
- `createdAt`: Date
- `updatedAt`: Date

## ExtractionRun

Represents one attempt to extract structured insight from project notes.

Fields:

- `_id`: ObjectId
- `projectId`: ObjectId reference to Project
- `researchNoteIds`: ObjectId[] references to ResearchNote
- `provider`: `mock | openai | anthropic | gemini`
- `schemaVersion`: `design_partner_extraction.v1`
- `status`: `queued | running | succeeded | failed`
- `startedAt`: Date
- `completedAt`: optional Date
- `errorMessage`: optional string
- `rawResponse`: optional object, sensitive/internal local-debug payload

## InsightItem

Represents one extracted, reviewable product insight.

Fields:

- `_id`: ObjectId
- `projectId`: ObjectId reference to Project
- `extractionRunId`: ObjectId reference to ExtractionRun
- `type`: InsightType
- `title`: string
- `summary`: string
- `payload`: optional object, potentially sensitive structured provider output
- `evidence`: EvidenceSnippet[]
- `confidence`: `low | medium | high`
- `reviewStatus`: `draft | accepted | edited | rejected | needs_follow_up`
- `decisionRecommendation`: optional `build_now | learn_more | ignore`
- `tags`: string[]
- `createdAt`: Date
- `updatedAt`: Date

## EvidenceSnippet

Embedded inside InsightItem for MVP. Evidence quotes are potentially sensitive because they may contain source-note language.

Fields:

- `researchNoteId`: ObjectId reference to ResearchNote
- `quote`: string
- `reason`: string

Embedding evidence keeps the review screen simple and avoids extra lookups while the data shape is still evolving.

## Data Sensitivity

Even with synthetic/demo data, model the domain as if real discovery notes may be sensitive later:

- `ResearchNote.rawText`: sensitive. Do not log by default. Do not expose outside project-scoped API responses.
- AI prompts derived from notes: sensitive. Do not persist or log by default unless intentionally scoped to local synthetic debugging.
- `ExtractionRun.rawResponse`: sensitive/internal. Do not expose to frontend responses by default.
- `InsightItem.evidence`: potentially sensitive. Include only what the review workflow needs.
- `InsightItem.payload`: potentially sensitive. Treat as internal unless a DTO explicitly maps safe fields.
- `errorMessage`: sanitized user-facing message, not a raw provider or stack trace.

Frontend responses should use explicit DTOs that omit internal provider/debug payloads by default.

Evidence is embedded in `InsightItem` for MVP simplicity, but that also means insight documents must be treated as potentially sensitive source-derived records.

## Project-Scoped Data Access

All ResearchNote, ExtractionRun, InsightItem, and dashboard reads/writes should be scoped by `projectId`. Future workspace/user authorization should be able to plug into this boundary without rewriting the model. Do not trust client-provided ownership fields; derive relationships from route parameters and server-side lookups.

Client-provided ownership or project scope should not be blindly trusted. The model should preserve future workspace/user authorization readiness by keeping project ownership explicit and consistently referenced.

## InsightType Enum

- `persona`
- `user_job`
- `pain_point`
- `workaround`
- `urgency_signal`
- `buying_trigger`
- `feature_hypothesis`
- `risk`
- `open_question`
- `pilot_success_criteria`
- `recommended_experiment`
- `decision_recommendation`
- `quality_flag`

## DashboardSummary

Computed for MVP, not stored.

Fields:

- accepted insight counts by type
- top pain points
- strongest urgency signals
- open questions
- recommended experiments
- decision recommendation counts

## Why One Flexible Insight Collection

Early discovery schemas change quickly. A single `InsightItem` collection with typed records is easier to evolve than many separate collections before the workflow stabilizes. It also keeps review status, evidence, confidence, and recommendations consistent across insight types.
