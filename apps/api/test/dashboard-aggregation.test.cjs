const assert = require('node:assert/strict');
const test = require('node:test');

const {
  buildProjectDashboardAggregation
} = require('../dist/dashboard/dashboard-aggregation.js');
const { InsightReviewStatus } = require('../dist/insights/enums/insight-review-status.enum.js');
const { InsightType } = require('../dist/insights/enums/insight-type.enum.js');

function insight(overrides) {
  return {
    id: overrides.id,
    noteId: '507f1f77bcf86cd799439011',
    type: overrides.type,
    title: overrides.title ?? 'Synthetic insight',
    summary: overrides.summary ?? 'Synthetic dashboard test summary.',
    confidence: overrides.confidence ?? 0.8,
    reviewStatus: overrides.reviewStatus,
    evidence: [
      {
        noteId: '507f1f77bcf86cd799439011',
        snippet: 'Synthetic evidence snippet.',
        source: 'mock_generic'
      }
    ],
    payload: overrides.payload,
    createdAt: overrides.createdAt ?? '2026-06-01T12:00:00.000Z',
    updatedAt: overrides.updatedAt ?? '2026-06-01T12:00:00.000Z'
  };
}

test('dashboard aggregation separates reviewed, unresolved, rejected, and unreviewed signal', () => {
  const dashboard = buildProjectDashboardAggregation([
    insight({
      id: 'accepted-pain',
      type: InsightType.PainPoint,
      reviewStatus: InsightReviewStatus.Accepted,
      confidence: 0.9
    }),
    insight({
      id: 'edited-persona',
      type: InsightType.Persona,
      reviewStatus: InsightReviewStatus.Edited,
      confidence: 0.8
    }),
    insight({
      id: 'follow-up-risk',
      type: InsightType.Risk,
      reviewStatus: InsightReviewStatus.NeedsFollowUp
    }),
    insight({
      id: 'rejected-job',
      type: InsightType.UserJob,
      reviewStatus: InsightReviewStatus.Rejected
    }),
    insight({
      id: 'unreviewed-experiment',
      type: InsightType.Experiment,
      reviewStatus: InsightReviewStatus.AiGenerated
    })
  ]);

  assert.equal(dashboard.primarySignalCount, 2);
  assert.equal(dashboard.unresolvedSignalCount, 1);
  assert.equal(dashboard.rejectedSignalCount, 1);
  assert.equal(dashboard.unreviewedSignalCount, 1);
  assert.deepEqual(
    dashboard.strongestPainPoints.map((item) => item.id),
    ['accepted-pain']
  );
  assert.deepEqual(
    dashboard.topUserJobs.map((item) => item.id),
    []
  );
  assert.deepEqual(
    dashboard.needsFollowUp.map((item) => item.id),
    ['follow-up-risk']
  );
});

test('dashboard aggregation buckets reviewed decision recommendations without exposing payload', () => {
  const dashboard = buildProjectDashboardAggregation([
    insight({
      id: 'build-now',
      type: InsightType.DecisionRecommendation,
      reviewStatus: InsightReviewStatus.Accepted,
      payload: { decision: 'build_now' }
    }),
    insight({
      id: 'learn-more',
      type: InsightType.DecisionRecommendation,
      reviewStatus: InsightReviewStatus.Edited,
      payload: { decision: 'learn_more' }
    }),
    insight({
      id: 'ignore-rejected',
      type: InsightType.DecisionRecommendation,
      reviewStatus: InsightReviewStatus.Rejected,
      payload: { decision: 'ignore_for_now' }
    })
  ]);

  assert.deepEqual(
    dashboard.decisionRecommendations.buildNow.map((item) => item.id),
    ['build-now']
  );
  assert.deepEqual(
    dashboard.decisionRecommendations.learnMore.map((item) => item.id),
    ['learn-more']
  );
  assert.deepEqual(dashboard.decisionRecommendations.ignoreForNow, []);
  assert.equal(
    Object.prototype.hasOwnProperty.call(dashboard.decisionRecommendations.buildNow[0], 'payload'),
    false
  );
});
