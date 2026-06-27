import { requestJson } from './client';

export interface DemoSeedResult {
  projectId: string;
  noteCount: number;
  insightCount: number;
  dashboardPath: string;
}

export interface DemoResetResult {
  deletedProjects: number;
  deletedNotes: number;
  deletedExtractionRuns: number;
  deletedInsights: number;
}

export function seedDemo(): Promise<DemoSeedResult> {
  return requestJson<DemoSeedResult>('/api/demo/seed', {
    method: 'POST'
  });
}

export function resetDemo(): Promise<DemoResetResult> {
  return requestJson<DemoResetResult>('/api/demo/reset', {
    method: 'POST'
  });
}
