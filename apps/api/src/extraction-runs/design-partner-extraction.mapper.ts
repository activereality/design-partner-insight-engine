import {
  DesignPartnerExtraction,
  ExtractionConfidence,
  ExtractionEvidenceStrength,
  ExtractionInsightBase,
  ExtractionUrgency
} from './design-partner-extraction.contract';
import { InsightReviewStatus } from '../insights/enums/insight-review-status.enum';
import { InsightType } from '../insights/enums/insight-type.enum';
import { InsightEvidence, InsightPayload } from '../insights/schemas/insight-item.schema';

export interface PersistableInsightDraft {
  type: InsightType;
  title: string;
  summary: string;
  confidence: number;
  urgency?: string;
  reviewStatus: InsightReviewStatus;
  evidence: InsightEvidence[];
  payload: InsightPayload;
}

interface MappedInsight {
  type: InsightType;
  category: string;
  insight: ExtractionInsightBase;
  urgency?: ExtractionUrgency;
  extraPayload?: InsightPayload;
}

export function mapExtractionToInsightDrafts(
  extraction: DesignPartnerExtraction,
  noteId: string
): PersistableInsightDraft[] {
  const mappedInsights: MappedInsight[] = [
    ...extraction.personas.map((insight) => ({
      type: InsightType.Persona,
      category: 'personas',
      insight,
      extraPayload: { segment: insight.segment }
    })),
    ...extraction.userJobs.map((insight) => ({
      type: InsightType.UserJob,
      category: 'userJobs',
      insight,
      extraPayload: { jobStatement: insight.jobStatement }
    })),
    ...extraction.painPoints.map((insight) => ({
      type: InsightType.PainPoint,
      category: 'painPoints',
      insight,
      urgency: insight.urgency
    })),
    ...extraction.currentWorkarounds.map((insight) => ({
      type: InsightType.Workaround,
      category: 'currentWorkarounds',
      insight,
      extraPayload: { currentApproach: insight.currentApproach }
    })),
    ...extraction.urgencySignals.map((insight) => ({
      type: InsightType.UrgencySignal,
      category: 'urgencySignals',
      insight,
      urgency: insight.urgency
    })),
    ...extraction.buyingTriggers.map((insight) => ({
      type: InsightType.BuyingTrigger,
      category: 'buyingTriggers',
      insight,
      extraPayload: { trigger: insight.trigger }
    })),
    ...extraction.featureHypotheses.map((insight) => ({
      type: InsightType.FeatureHypothesis,
      category: 'featureHypotheses',
      insight,
      extraPayload: { hypothesis: insight.hypothesis }
    })),
    ...extraction.risks.map((insight) => ({
      type: InsightType.Risk,
      category: 'risks',
      insight,
      extraPayload: { risk: insight.risk }
    })),
    ...extraction.openQuestions.map((insight) => ({
      type: InsightType.OpenQuestion,
      category: 'openQuestions',
      insight,
      extraPayload: { question: insight.question }
    })),
    ...extraction.pilotSuccessCriteria.map((insight) => ({
      type: InsightType.PilotSuccessCriterion,
      category: 'pilotSuccessCriteria',
      insight,
      extraPayload: { criterion: insight.criterion }
    })),
    ...extraction.recommendedExperiments.map((insight) => ({
      type: InsightType.Experiment,
      category: 'recommendedExperiments',
      insight,
      extraPayload: { experiment: insight.experiment }
    })),
    ...extraction.decisionRecommendations.map((insight) => ({
      type: InsightType.DecisionRecommendation,
      category: 'decisionRecommendations',
      insight,
      extraPayload: { decision: insight.decision }
    }))
  ];

  return mappedInsights.map(({ type, category, insight, urgency, extraPayload }) => ({
    type,
    title: insight.title,
    summary: insight.summary,
    confidence: confidenceToNumber(insight.confidence),
    ...(urgency ? { urgency } : {}),
    reviewStatus: InsightReviewStatus.AiGenerated,
    evidence: insight.evidence.map((item): InsightEvidence => ({
      noteId,
      snippet: item.quote.slice(0, 180),
      source: 'mock_generic'
    })),
    payload: {
      category,
      confidenceLabel: insight.confidence,
      evidenceStrength: insight.evidenceStrength,
      directlyStated: insight.directlyStated,
      whyItMatters: insight.evidence[0]?.whyItMatters ?? '',
      ...(extraPayload ?? {})
    }
  }));
}

function confidenceToNumber(confidence: ExtractionConfidence): number {
  switch (confidence) {
    case 'high':
      return 0.9;
    case 'medium':
      return 0.7;
    case 'low':
      return 0.4;
  }
}
