export interface DemoSeedResponse {
  projectId: string;
  noteCount: number;
  insightCount: number;
  dashboardPath: string;
}

export interface DemoResetResponse {
  deletedProjects: number;
  deletedNotes: number;
  deletedExtractionRuns: number;
  deletedInsights: number;
}
