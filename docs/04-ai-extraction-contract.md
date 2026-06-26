# AI Extraction Contract

## Design Principles

- Use AI to organize evidence, not invent certainty.
- Keep provider code behind an abstraction.
- Start with deterministic mock output.
- Validate before saving or displaying.
- Require evidence for insight and recommendation claims.
- Treat prompts, provider responses, extracted insights, and evidence quotes as potentially sensitive.

## Provider Abstraction

The backend should depend on an interface such as `AiExtractionProvider`. Provider adapters can implement mock, OpenAI, Anthropic, or Gemini behavior later without changing controllers or review workflow code.

Provider keys must stay server-side. The frontend should never receive provider secrets, raw provider responses, or provider-specific internal errors.

## Provider Order

1. Mock provider first for local demo stability.
2. OpenAI provider later.
3. Anthropic/Gemini adapters only when useful.

The mock provider should remain the default for demos and development without API keys. Real provider calls must remain server-side.

## Schema Version

`design_partner_extraction.v1`

## TypeScript-Style Schema

```ts
type ExtractionSchemaVersion = 'design_partner_extraction.v1';

type InsightType =
  | 'persona'
  | 'user_job'
  | 'pain_point'
  | 'workaround'
  | 'urgency_signal'
  | 'buying_trigger'
  | 'feature_hypothesis'
  | 'risk'
  | 'open_question'
  | 'pilot_success_criteria'
  | 'recommended_experiment'
  | 'decision_recommendation'
  | 'quality_flag';

type ReviewStatus =
  | 'draft'
  | 'accepted'
  | 'edited'
  | 'rejected'
  | 'needs_follow_up';

type DecisionRecommendation = 'build_now' | 'learn_more' | 'ignore';

interface ExtractionResult {
  schemaVersion: ExtractionSchemaVersion;
  projectSummary: string;
  insights: ExtractedInsight[];
  qualityFlags: QualityFlag[];
}

interface ExtractedInsight {
  type: InsightType;
  title: string;
  summary: string;
  evidence: EvidenceSnippet[];
  confidence: 'low' | 'medium' | 'high';
  reviewStatus: ReviewStatus;
  decisionRecommendation?: DecisionRecommendation;
  tags: string[];
}

interface EvidenceSnippet {
  sourceNoteId: string;
  quote: string;
  reason: string;
}

interface QualityFlag {
  title: string;
  summary: string;
  severity: 'low' | 'medium' | 'high';
}
```

## Required Insight Types

The extraction contract must support personas, user jobs, pain points, workarounds, urgency signals, buying triggers, feature hypotheses, risks, open questions, pilot success criteria, recommended experiments, decision recommendations, and quality flags.

## Evidence Requirements

Every insight that affects a decision must include at least one evidence snippet. Evidence should reference a source note and explain why the snippet supports the insight.

## Confidence Requirements

Confidence should reflect evidence strength, repetition, specificity, and ambiguity. Low confidence is acceptable when clearly labeled.

## Review Status Lifecycle

Default AI output starts as `draft`. A human can move an insight to `accepted`, `edited`, `rejected`, or `needs_follow_up`.

## Prompt Requirements

Prompts should instruct the provider to:

- use only supplied notes
- preserve uncertainty
- cite evidence snippets
- separate facts from hypotheses
- produce the requested schema version
- avoid unsupported recommendations

## Validation And Failure Behavior

If output is malformed, unsupported, missing evidence, or missing required fields, the system should fail gracefully and show a clear extraction error. Invalid output should not be saved as accepted insight.

Validation belongs on the backend before persistence. Prefer explicit schemas, enums, and bounded text fields over loose `any` shapes.

Raw provider errors should be normalized before reaching the frontend. The UI should receive a safe message such as "Extraction failed. Please retry or review the input." rather than provider stack traces, raw payloads, or internal validation traces.

## Logging And Error Handling

Avoid logging raw note contents, prompts, API keys, or full provider responses. If local debugging needs richer logs, keep them clearly scoped to synthetic data and do not enable them by default.

Errors returned to the frontend should be sanitized and actionable. Do not expose provider stack traces, raw provider payloads, or internal validation traces.

Persisting raw AI responses is allowed only as an explicit local/debug choice. Revisit or remove raw response persistence before any deployment that can handle real user data.

## No Ungrounded Recommendations

Decision recommendations must be tied to evidence. If the notes do not support a recommendation, produce an open question or quality flag instead.
