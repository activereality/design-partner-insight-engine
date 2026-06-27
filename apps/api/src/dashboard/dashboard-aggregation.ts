import { InsightReviewStatus } from '../insights/enums/insight-review-status.enum';
import { InsightType } from '../insights/enums/insight-type.enum';
import { InsightEvidence, InsightPayload } from '../insights/schemas/insight-item.schema';

const PRIMARY_REVIEW_STATUSES = new Set<InsightReviewStatus>([
  InsightReviewStatus.Accepted,
  InsightReviewStatus.Edited
]);

const DECISION_BUCKETS = ['build_now', 'learn_more', 'ignore_for_now'] as const;

type DecisionBucket = (typeof DECISION_BUCKETS)[number];

export interface DashboardSourceInsight {
  id: string;
  noteId: string;
  type: InsightType;
  title: string;
  summary: string;
  confidence: number;
  urgency?: string;
  reviewStatus: InsightReviewStatus;
  evidence: InsightEvidence[];
  payload?: InsightPayload;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardInsightSummary {
  id: string;
  noteId: string;
  type: InsightType;
  title: string;
  summary: string;
  confidence: number;
  urgency?: string;
  reviewStatus: InsightReviewStatus;
  evidence: InsightEvidence[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardDecisionRecommendations {
  buildNow: DashboardInsightSummary[];
  learnMore: DashboardInsightSummary[];
  ignoreForNow: DashboardInsightSummary[];
}

export interface DashboardAggregation {
  countsByType: Record<InsightType, number>;
  countsByReviewStatus: Record<InsightReviewStatus, number>;
  primarySignalCount: number;
  unresolvedSignalCount: number;
  unreviewedSignalCount: number;
  rejectedSignalCount: number;
  strongestPainPoints: DashboardInsightSummary[];
  topPersonas: DashboardInsightSummary[];
  topUserJobs: DashboardInsightSummary[];
  featureHypotheses: DashboardInsightSummary[];
  risks: DashboardInsightSummary[];
  openQuestions: DashboardInsightSummary[];
  pilotSuccessCriteria: DashboardInsightSummary[];
  recommendedExperiments: DashboardInsightSummary[];
  needsFollowUp: DashboardInsightSummary[];
  decisionRecommendations: DashboardDecisionRecommendations;
}

export function buildProjectDashboardAggregation(
  insights: DashboardSourceInsight[]
): DashboardAggregation {
  const countsByType = createEnumCounts(Object.values(InsightType));
  const countsByReviewStatus = createEnumCounts(Object.values(InsightReviewStatus));

  for (const insight of insights) {
    countsByType[insight.type] += 1;
    countsByReviewStatus[insight.reviewStatus] += 1;
  }

  const primaryInsights = sortForDashboard(
    insights.filter((insight) => PRIMARY_REVIEW_STATUSES.has(insight.reviewStatus))
  );
  const needsFollowUp = sortForDashboard(
    insights.filter((insight) => insight.reviewStatus === InsightReviewStatus.NeedsFollowUp)
  );

  return {
    countsByType,
    countsByReviewStatus,
    primarySignalCount: primaryInsights.length,
    unresolvedSignalCount: needsFollowUp.length,
    unreviewedSignalCount: countsByReviewStatus[InsightReviewStatus.AiGenerated],
    rejectedSignalCount: countsByReviewStatus[InsightReviewStatus.Rejected],
    strongestPainPoints: byType(primaryInsights, InsightType.PainPoint),
    topPersonas: byType(primaryInsights, InsightType.Persona),
    topUserJobs: byType(primaryInsights, InsightType.UserJob),
    featureHypotheses: byType(primaryInsights, InsightType.FeatureHypothesis),
    risks: byType(primaryInsights, InsightType.Risk),
    openQuestions: byType(primaryInsights, InsightType.OpenQuestion),
    pilotSuccessCriteria: byType(primaryInsights, InsightType.PilotSuccessCriterion),
    recommendedExperiments: byType(primaryInsights, InsightType.Experiment),
    needsFollowUp: needsFollowUp.map(toDashboardInsightSummary),
    decisionRecommendations: buildDecisionRecommendations(primaryInsights)
  };
}

function createEnumCounts<T extends string>(values: T[]): Record<T, number> {
  return values.reduce(
    (counts, value) => ({
      ...counts,
      [value]: 0
    }),
    {} as Record<T, number>
  );
}

function byType(
  insights: DashboardSourceInsight[],
  type: InsightType
): DashboardInsightSummary[] {
  return insights.filter((insight) => insight.type === type).map(toDashboardInsightSummary);
}

function buildDecisionRecommendations(
  insights: DashboardSourceInsight[]
): DashboardDecisionRecommendations {
  const decisionInsights = insights.filter(
    (insight) => insight.type === InsightType.DecisionRecommendation
  );

  return {
    buildNow: byDecision(decisionInsights, 'build_now'),
    learnMore: byDecision(decisionInsights, 'learn_more'),
    ignoreForNow: byDecision(decisionInsights, 'ignore_for_now')
  };
}

function byDecision(
  insights: DashboardSourceInsight[],
  decision: DecisionBucket
): DashboardInsightSummary[] {
  return insights
    .filter((insight) => insight.payload?.decision === decision)
    .map(toDashboardInsightSummary);
}

function sortForDashboard(insights: DashboardSourceInsight[]): DashboardSourceInsight[] {
  return [...insights].sort((left, right) => {
    const confidenceDifference = right.confidence - left.confidence;

    if (confidenceDifference !== 0) {
      return confidenceDifference;
    }

    return Date.parse(right.createdAt) - Date.parse(left.createdAt);
  });
}

function toDashboardInsightSummary(insight: DashboardSourceInsight): DashboardInsightSummary {
  return {
    id: insight.id,
    noteId: insight.noteId,
    type: insight.type,
    title: insight.title,
    summary: insight.summary,
    confidence: insight.confidence,
    ...(insight.urgency ? { urgency: insight.urgency } : {}),
    reviewStatus: insight.reviewStatus,
    evidence: insight.evidence.map((item) => ({
      noteId: item.noteId,
      snippet: item.snippet,
      source: item.source
    })),
    createdAt: insight.createdAt,
    updatedAt: insight.updatedAt
  };
}
