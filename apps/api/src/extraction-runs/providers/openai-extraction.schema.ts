import {
  confidenceValues,
  decisionValues,
  DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION,
  evidenceStrengthValues,
  urgencyValues
} from '../design-partner-extraction.contract';

type JsonSchema = Record<string, unknown>;

const evidenceSchema: JsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['quote', 'whyItMatters'],
  properties: {
    quote: { type: 'string', minLength: 1, maxLength: 180 },
    whyItMatters: { type: 'string', minLength: 1, maxLength: 240 }
  }
};

function insightSchema(extraProperties: JsonSchema): JsonSchema {
  return {
    type: 'object',
    additionalProperties: false,
    required: [
      'title',
      'summary',
      'evidence',
      'confidence',
      'evidenceStrength',
      'directlyStated',
      ...Object.keys(extraProperties)
    ],
    properties: {
      title: { type: 'string', minLength: 1, maxLength: 160 },
      summary: { type: 'string', minLength: 1, maxLength: 1000 },
      evidence: { type: 'array', minItems: 1, items: evidenceSchema },
      confidence: { type: 'string', enum: confidenceValues },
      evidenceStrength: { type: 'string', enum: evidenceStrengthValues },
      directlyStated: { type: 'boolean' },
      ...extraProperties
    }
  };
}

function insightArraySchema(extraProperties: JsonSchema): JsonSchema {
  return {
    type: 'array',
    items: insightSchema(extraProperties)
  };
}

export const designPartnerExtractionJsonSchema: JsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'schemaVersion',
    'noteSummary',
    'personas',
    'userJobs',
    'painPoints',
    'currentWorkarounds',
    'urgencySignals',
    'buyingTriggers',
    'featureHypotheses',
    'risks',
    'openQuestions',
    'pilotSuccessCriteria',
    'recommendedExperiments',
    'decisionRecommendations',
    'qualityFlags'
  ],
  properties: {
    schemaVersion: { type: 'string', const: DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION },
    noteSummary: { type: 'string', minLength: 1, maxLength: 600 },
    personas: insightArraySchema({ segment: { type: 'string', minLength: 1, maxLength: 160 } }),
    userJobs: insightArraySchema({
      jobStatement: { type: 'string', minLength: 1, maxLength: 240 }
    }),
    painPoints: insightArraySchema({ urgency: { type: 'string', enum: urgencyValues } }),
    currentWorkarounds: insightArraySchema({
      currentApproach: { type: 'string', minLength: 1, maxLength: 240 }
    }),
    urgencySignals: insightArraySchema({ urgency: { type: 'string', enum: urgencyValues } }),
    buyingTriggers: insightArraySchema({
      trigger: { type: 'string', minLength: 1, maxLength: 240 }
    }),
    featureHypotheses: insightArraySchema({
      hypothesis: { type: 'string', minLength: 1, maxLength: 300 }
    }),
    risks: insightArraySchema({ risk: { type: 'string', minLength: 1, maxLength: 240 } }),
    openQuestions: insightArraySchema({
      question: { type: 'string', minLength: 1, maxLength: 240 }
    }),
    pilotSuccessCriteria: insightArraySchema({
      criterion: { type: 'string', minLength: 1, maxLength: 240 }
    }),
    recommendedExperiments: insightArraySchema({
      experiment: { type: 'string', minLength: 1, maxLength: 300 }
    }),
    decisionRecommendations: insightArraySchema({
      decision: { type: 'string', enum: decisionValues }
    }),
    qualityFlags: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'summary', 'severity'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 160 },
          summary: { type: 'string', minLength: 1, maxLength: 600 },
          severity: { type: 'string', enum: urgencyValues }
        }
      }
    }
  }
};
