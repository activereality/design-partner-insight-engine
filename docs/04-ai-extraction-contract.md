# AI Extraction Contract

## Design Principles

- Use AI to organize evidence, not invent certainty.
- Keep provider code behind an abstraction.
- Start with deterministic mock output.
- Validate before saving or displaying.
- Require evidence for insight and recommendation claims.
- Treat prompts, provider responses, extracted insights, and evidence quotes as potentially sensitive.

## Provider Abstraction

The backend depends on a provider interface that returns `DesignPartnerExtraction`. Provider adapters can implement mock, OpenAI, Anthropic, or Gemini behavior without changing controllers or review workflow code.

Provider keys must stay server-side. The frontend should never receive provider secrets, raw provider responses, or provider-specific internal errors.

## Provider Order

1. Mock provider first for local demo stability.
2. OpenAI provider is optional and server-side only.
3. Anthropic/Gemini adapters only when useful.

The mock provider should remain the default for demos and development without API keys. Real provider calls must remain server-side.

## OpenAI Provider Behavior

The OpenAI provider uses the official OpenAI Node SDK and the Responses API. It requests structured output with a JSON schema aligned to `design_partner_extraction.v1`, then passes the returned object through the same runtime validator used by the mock provider before persistence.

`AI_PROVIDER=openai` requires server-side `OPENAI_API_KEY` and `OPENAI_MODEL`. These values are never exposed to the frontend. The provider does not log prompts or raw provider responses, and normal extraction run responses do not expose raw provider/debug payloads.

## Schema Version

`design_partner_extraction.v1`

The backend keeps this value as a code constant and rejects unsupported schema versions before persistence.

## Prompt Version

`mock_prompt.v1`

The mock prompt version is a placeholder constant for deterministic local extraction. Real prompts and provider-specific prompt versions are deferred.

## TypeScript-Style Schema

```ts
type ExtractionSchemaVersion = 'design_partner_extraction.v1';

type Confidence = 'low' | 'medium' | 'high';
type Urgency = 'low' | 'medium' | 'high' | 'unknown';
type EvidenceStrength = 'weak' | 'moderate' | 'strong';
type DecisionRecommendation = 'build_now' | 'learn_more' | 'ignore_for_now';

interface DesignPartnerExtraction {
  schemaVersion: ExtractionSchemaVersion;
  noteSummary: string;
  personas: PersonaInsight[];
  userJobs: UserJobInsight[];
  painPoints: PainPointInsight[];
  currentWorkarounds: WorkaroundInsight[];
  urgencySignals: UrgencySignalInsight[];
  buyingTriggers: BuyingTriggerInsight[];
  featureHypotheses: FeatureHypothesisInsight[];
  risks: RiskInsight[];
  openQuestions: OpenQuestionInsight[];
  pilotSuccessCriteria: PilotSuccessCriterionInsight[];
  recommendedExperiments: RecommendedExperimentInsight[];
  decisionRecommendations: DecisionRecommendationInsight[];
  qualityFlags: QualityFlag[];
}

interface ExtractionInsightBase {
  title: string;
  summary: string;
  evidence: EvidenceSnippet[];
  confidence: Confidence;
  evidenceStrength: EvidenceStrength;
  directlyStated: boolean;
}

interface EvidenceSnippet {
  quote: string;
  whyItMatters: string;
}

interface PersonaInsight extends ExtractionInsightBase { segment: string; }
interface UserJobInsight extends ExtractionInsightBase { jobStatement: string; }
interface PainPointInsight extends ExtractionInsightBase { urgency: Urgency; }
interface WorkaroundInsight extends ExtractionInsightBase { currentApproach: string; }
interface UrgencySignalInsight extends ExtractionInsightBase { urgency: Urgency; }
interface BuyingTriggerInsight extends ExtractionInsightBase { trigger: string; }
interface FeatureHypothesisInsight extends ExtractionInsightBase { hypothesis: string; }
interface RiskInsight extends ExtractionInsightBase { risk: string; }
interface OpenQuestionInsight extends ExtractionInsightBase { question: string; }
interface PilotSuccessCriterionInsight extends ExtractionInsightBase { criterion: string; }
interface RecommendedExperimentInsight extends ExtractionInsightBase { experiment: string; }
interface DecisionRecommendationInsight extends ExtractionInsightBase {
  decision: DecisionRecommendation;
}

interface QualityFlag {
  title: string;
  summary: string;
  severity: Urgency;
}
```

## Required Insight Types

The extraction contract must support personas, user jobs, pain points, workarounds, urgency signals, buying triggers, feature hypotheses, risks, open questions, pilot success criteria, recommended experiments, decision recommendations, and quality flags.

## Evidence Requirements

Every insight that affects a decision must include at least one evidence snippet. Evidence should reference a source note and explain why the snippet supports the insight.

## Confidence Requirements

Confidence should reflect evidence strength, repetition, specificity, and ambiguity. Low confidence is acceptable when clearly labeled.

## Review Status Lifecycle

Default persisted AI output starts as `ai_generated`. The review workflow can move an insight through accepted, edited, rejected, or needs-follow-up states.

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

The current implementation uses a backend-local runtime parser for `design_partner_extraction.v1`. Mock and OpenAI extraction output is parsed before `InsightItem` records are created. Validation failure marks the extraction run as failed with safe metadata and does not expose raw output to frontend responses.

Raw provider errors should be normalized before reaching the frontend. The UI should receive a safe message such as "Extraction failed. Please retry or review the input." rather than provider stack traces, raw payloads, or internal validation traces.

## Logging And Error Handling

Avoid logging raw note contents, prompts, API keys, or full provider responses. If local debugging needs richer logs, keep them clearly scoped to synthetic data and do not enable them by default.

Errors returned to the frontend should be sanitized and actionable. Do not expose provider stack traces, raw provider payloads, or internal validation traces.

Persisting full raw AI responses is out of scope for the current implementation. If a future local/debug feature stores them, it must be explicit and revisited before any deployment that can handle real user data.

## No Ungrounded Recommendations

Decision recommendations must be tied to evidence. If the notes do not support a recommendation, produce an open question or quality flag instead.
