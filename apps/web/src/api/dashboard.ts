import { requestJson } from './client';
import { type InsightEvidence } from './extraction';
import { type Project } from './projects';

export type DashboardReviewStatus =
  | 'ai_generated'
  | 'accepted'
  | 'edited'
  | 'rejected'
  | 'needs_follow_up';

export type DashboardInsightType =
  | 'persona'
  | 'user_job'
  | 'pain_point'
  | 'workaround'
  | 'urgency_signal'
  | 'buying_trigger'
  | 'feature_hypothesis'
  | 'risk'
  | 'open_question'
  | 'pilot_success_criterion'
  | 'experiment'
  | 'decision_recommendation'
  | 'theme';

export interface DashboardInsightSummary {
  id: string;
  noteId: string;
  type: DashboardInsightType;
  title: string;
  summary: string;
  confidence: number;
  urgency?: string;
  reviewStatus: DashboardReviewStatus;
  evidence: InsightEvidence[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardDecisionRecommendations {
  buildNow: DashboardInsightSummary[];
  learnMore: DashboardInsightSummary[];
  ignoreForNow: DashboardInsightSummary[];
}

export interface ProjectDashboard {
  project: Project;
  noteCount: number;
  insightCount: number;
  countsByType: Record<DashboardInsightType, number>;
  countsByReviewStatus: Record<DashboardReviewStatus, number>;
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

export function getProjectDashboard(projectId: string): Promise<ProjectDashboard> {
  return requestJson<ProjectDashboard>(`/api/projects/${projectId}/dashboard`);
}
