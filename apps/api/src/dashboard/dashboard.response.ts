import {
  DashboardAggregation,
  DashboardDecisionRecommendations,
  DashboardInsightSummary
} from './dashboard-aggregation';
import { ProjectResponse } from '../projects/project.response';

export interface ProjectDashboardResponse extends DashboardAggregation {
  project: ProjectResponse;
  noteCount: number;
  insightCount: number;
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
