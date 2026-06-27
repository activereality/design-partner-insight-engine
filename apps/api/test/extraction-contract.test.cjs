const assert = require('node:assert/strict');
const test = require('node:test');

const {
  DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION,
  ExtractionValidationError,
  parseDesignPartnerExtraction
} = require('../dist/extraction-runs/design-partner-extraction.contract.js');
const {
  mapExtractionToInsightDrafts
} = require('../dist/extraction-runs/design-partner-extraction.mapper.js');
const { validateEnvironment } = require('../dist/config/env.validation.js');

function validExtraction() {
  const evidence = [
    {
      quote: 'Synthetic evidence from a local demo note.',
      whyItMatters: 'It anchors the mock output without using private data.'
    }
  ];

  return {
    schemaVersion: DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION,
    noteSummary: 'Synthetic summary for validation tests.',
    personas: [],
    userJobs: [
      {
        title: 'Synthesize notes',
        summary: 'Turn discovery notes into next-step decisions.',
        evidence,
        confidence: 'medium',
        evidenceStrength: 'moderate',
        directlyStated: false,
        jobStatement: 'Synthesize discovery notes into decisions.'
      }
    ],
    painPoints: [],
    currentWorkarounds: [],
    urgencySignals: [],
    buyingTriggers: [],
    featureHypotheses: [],
    risks: [],
    openQuestions: [],
    pilotSuccessCriteria: [],
    recommendedExperiments: [],
    decisionRecommendations: [],
    qualityFlags: []
  };
}

test('valid design partner extraction passes validation', () => {
  const parsed = parseDesignPartnerExtraction(validExtraction());

  assert.equal(parsed.schemaVersion, DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION);
  assert.equal(parsed.userJobs.length, 1);
});

test('invalid design partner extraction fails validation', () => {
  const invalid = validExtraction();
  invalid.userJobs[0].evidence = [];

  assert.throws(() => parseDesignPartnerExtraction(invalid), ExtractionValidationError);
});

test('validated extraction maps to persistable insight drafts', () => {
  const parsed = parseDesignPartnerExtraction(validExtraction());
  const drafts = mapExtractionToInsightDrafts(parsed, '507f1f77bcf86cd799439011');

  assert.equal(drafts.length, 1);
  assert.equal(drafts[0].type, 'user_job');
  assert.equal(drafts[0].reviewStatus, 'ai_generated');
  assert.equal(drafts[0].evidence[0].noteId, '507f1f77bcf86cd799439011');
  assert.equal(drafts[0].payload.category, 'userJobs');
});

test('environment validation defaults AI provider to mock', () => {
  const env = validateEnvironment({
    PORT: '3000',
    NODE_ENV: 'test',
    MONGODB_URI: 'mongodb://localhost:27017/signalforge'
  });

  assert.equal(env.AI_PROVIDER, 'mock');
});

test('environment validation requires OpenAI config only when OpenAI is selected', () => {
  assert.throws(
    () =>
      validateEnvironment({
        PORT: '3000',
        NODE_ENV: 'test',
        MONGODB_URI: 'mongodb://localhost:27017/signalforge',
        AI_PROVIDER: 'openai'
      }),
    /OPENAI_API_KEY and OPENAI_MODEL/
  );

  const env = validateEnvironment({
    PORT: '3000',
    NODE_ENV: 'test',
    MONGODB_URI: 'mongodb://localhost:27017/signalforge',
    AI_PROVIDER: 'openai',
    OPENAI_API_KEY: 'test-only-key',
    OPENAI_MODEL: 'test-only-model'
  });

  assert.equal(env.AI_PROVIDER, 'openai');
  assert.equal(env.OPENAI_MODEL, 'test-only-model');
});
