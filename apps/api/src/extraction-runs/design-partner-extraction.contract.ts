export const DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION = 'design_partner_extraction.v1';
export const MOCK_EXTRACTION_PROMPT_VERSION = 'mock_prompt.v1';
export const MOCK_EXTRACTION_MODEL = 'mock-design-partner-extractor';

export const confidenceValues = ['low', 'medium', 'high'] as const;
export const urgencyValues = ['low', 'medium', 'high', 'unknown'] as const;
export const evidenceStrengthValues = ['weak', 'moderate', 'strong'] as const;
export const decisionValues = ['build_now', 'learn_more', 'ignore_for_now'] as const;

export type ExtractionConfidence = (typeof confidenceValues)[number];
export type ExtractionUrgency = (typeof urgencyValues)[number];
export type ExtractionEvidenceStrength = (typeof evidenceStrengthValues)[number];
export type ExtractionDecision = (typeof decisionValues)[number];

export interface ExtractionEvidence {
  quote: string;
  whyItMatters: string;
}

export interface ExtractionInsightBase {
  title: string;
  summary: string;
  evidence: ExtractionEvidence[];
  confidence: ExtractionConfidence;
  evidenceStrength: ExtractionEvidenceStrength;
  directlyStated: boolean;
}

export interface PersonaInsight extends ExtractionInsightBase {
  segment: string;
}

export interface UserJobInsight extends ExtractionInsightBase {
  jobStatement: string;
}

export interface PainPointInsight extends ExtractionInsightBase {
  urgency: ExtractionUrgency;
}

export interface WorkaroundInsight extends ExtractionInsightBase {
  currentApproach: string;
}

export interface UrgencySignalInsight extends ExtractionInsightBase {
  urgency: ExtractionUrgency;
}

export interface BuyingTriggerInsight extends ExtractionInsightBase {
  trigger: string;
}

export interface FeatureHypothesisInsight extends ExtractionInsightBase {
  hypothesis: string;
}

export interface RiskInsight extends ExtractionInsightBase {
  risk: string;
}

export interface OpenQuestionInsight extends ExtractionInsightBase {
  question: string;
}

export interface PilotSuccessCriterionInsight extends ExtractionInsightBase {
  criterion: string;
}

export interface RecommendedExperimentInsight extends ExtractionInsightBase {
  experiment: string;
}

export interface DecisionRecommendationInsight extends ExtractionInsightBase {
  decision: ExtractionDecision;
}

export interface QualityFlag {
  title: string;
  summary: string;
  severity: ExtractionUrgency;
}

export interface DesignPartnerExtraction {
  schemaVersion: typeof DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION;
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

type MutableDesignPartnerExtraction = {
  -readonly [Key in keyof DesignPartnerExtraction]: DesignPartnerExtraction[Key];
};

export class ExtractionValidationError extends Error {
  constructor(message = 'Extraction output failed validation') {
    super(message);
    this.name = 'ExtractionValidationError';
  }
}

export function parseDesignPartnerExtraction(value: unknown): DesignPartnerExtraction {
  const record = expectRecord(value, 'extraction');
  const schemaVersion = expectLiteral(
    record.schemaVersion,
    DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION,
    'schemaVersion'
  );

  return {
    schemaVersion,
    noteSummary: expectString(record.noteSummary, 'noteSummary', 1, 600),
    personas: expectInsightArray(record.personas, 'personas', {
      segment: (item) => expectString(item.segment, 'personas.segment', 1, 160)
    }),
    userJobs: expectInsightArray(record.userJobs, 'userJobs', {
      jobStatement: (item) => expectString(item.jobStatement, 'userJobs.jobStatement', 1, 240)
    }),
    painPoints: expectInsightArray(record.painPoints, 'painPoints', {
      urgency: (item) => expectEnum(item.urgency, urgencyValues, 'painPoints.urgency')
    }),
    currentWorkarounds: expectInsightArray(record.currentWorkarounds, 'currentWorkarounds', {
      currentApproach: (item) =>
        expectString(item.currentApproach, 'currentWorkarounds.currentApproach', 1, 240)
    }),
    urgencySignals: expectInsightArray(record.urgencySignals, 'urgencySignals', {
      urgency: (item) => expectEnum(item.urgency, urgencyValues, 'urgencySignals.urgency')
    }),
    buyingTriggers: expectInsightArray(record.buyingTriggers, 'buyingTriggers', {
      trigger: (item) => expectString(item.trigger, 'buyingTriggers.trigger', 1, 240)
    }),
    featureHypotheses: expectInsightArray(record.featureHypotheses, 'featureHypotheses', {
      hypothesis: (item) =>
        expectString(item.hypothesis, 'featureHypotheses.hypothesis', 1, 300)
    }),
    risks: expectInsightArray(record.risks, 'risks', {
      risk: (item) => expectString(item.risk, 'risks.risk', 1, 240)
    }),
    openQuestions: expectInsightArray(record.openQuestions, 'openQuestions', {
      question: (item) => expectString(item.question, 'openQuestions.question', 1, 240)
    }),
    pilotSuccessCriteria: expectInsightArray(
      record.pilotSuccessCriteria,
      'pilotSuccessCriteria',
      {
        criterion: (item) =>
          expectString(item.criterion, 'pilotSuccessCriteria.criterion', 1, 240)
      }
    ),
    recommendedExperiments: expectInsightArray(
      record.recommendedExperiments,
      'recommendedExperiments',
      {
        experiment: (item) =>
          expectString(item.experiment, 'recommendedExperiments.experiment', 1, 300)
      }
    ),
    decisionRecommendations: expectInsightArray(
      record.decisionRecommendations,
      'decisionRecommendations',
      {
        decision: (item) =>
          expectEnum(item.decision, decisionValues, 'decisionRecommendations.decision')
      }
    ),
    qualityFlags: expectQualityFlags(record.qualityFlags)
  } satisfies MutableDesignPartnerExtraction;
}

function expectInsightArray<ExtraFields extends Record<string, unknown>>(
  value: unknown,
  path: string,
  extraValidators: {
    [Key in keyof ExtraFields]: (item: Record<string, unknown>) => ExtraFields[Key];
  }
): Array<ExtractionInsightBase & ExtraFields> {
  if (!Array.isArray(value)) {
    throw new ExtractionValidationError(`${path} must be an array`);
  }

  return value.map((item, index) => {
    const record = expectRecord(item, `${path}[${index}]`);
    const extra = Object.fromEntries(
      Object.entries(extraValidators).map(([key, validator]) => [key, validator(record)])
    ) as ExtraFields;

    return {
      title: expectString(record.title, `${path}[${index}].title`, 1, 160),
      summary: expectString(record.summary, `${path}[${index}].summary`, 1, 1000),
      evidence: expectEvidenceArray(record.evidence, `${path}[${index}].evidence`),
      confidence: expectEnum(record.confidence, confidenceValues, `${path}[${index}].confidence`),
      evidenceStrength: expectEnum(
        record.evidenceStrength,
        evidenceStrengthValues,
        `${path}[${index}].evidenceStrength`
      ),
      directlyStated: expectBoolean(record.directlyStated, `${path}[${index}].directlyStated`),
      ...extra
    };
  });
}

function expectEvidenceArray(value: unknown, path: string): ExtractionEvidence[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new ExtractionValidationError(`${path} must include at least one item`);
  }

  return value.map((item, index) => {
    const record = expectRecord(item, `${path}[${index}]`);

    return {
      quote: expectString(record.quote, `${path}[${index}].quote`, 1, 180),
      whyItMatters: expectString(
        record.whyItMatters,
        `${path}[${index}].whyItMatters`,
        1,
        240
      )
    };
  });
}

function expectQualityFlags(value: unknown): QualityFlag[] {
  if (!Array.isArray(value)) {
    throw new ExtractionValidationError('qualityFlags must be an array');
  }

  return value.map((item, index) => {
    const record = expectRecord(item, `qualityFlags[${index}]`);

    return {
      title: expectString(record.title, `qualityFlags[${index}].title`, 1, 160),
      summary: expectString(record.summary, `qualityFlags[${index}].summary`, 1, 600),
      severity: expectEnum(record.severity, urgencyValues, `qualityFlags[${index}].severity`)
    };
  });
}

function expectRecord(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ExtractionValidationError(`${path} must be an object`);
  }

  return value as Record<string, unknown>;
}

function expectString(value: unknown, path: string, min: number, max: number): string {
  if (typeof value !== 'string') {
    throw new ExtractionValidationError(`${path} must be a string`);
  }

  const trimmed = value.trim();

  if (trimmed.length < min || trimmed.length > max) {
    throw new ExtractionValidationError(`${path} length is invalid`);
  }

  return trimmed;
}

function expectBoolean(value: unknown, path: string): boolean {
  if (typeof value !== 'boolean') {
    throw new ExtractionValidationError(`${path} must be a boolean`);
  }

  return value;
}

function expectEnum<const T extends readonly string[]>(
  value: unknown,
  values: T,
  path: string
): T[number] {
  if (typeof value !== 'string' || !values.includes(value)) {
    throw new ExtractionValidationError(`${path} has unsupported value`);
  }

  return value;
}

function expectLiteral<const T extends string>(value: unknown, literal: T, path: string): T {
  if (value !== literal) {
    throw new ExtractionValidationError(`${path} has unsupported value`);
  }

  return literal;
}
