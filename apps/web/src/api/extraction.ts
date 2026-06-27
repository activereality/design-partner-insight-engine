import { requestJson } from './client';

export interface InsightEvidence {
  noteId: string;
  snippet: string;
  source: 'mock_generic';
}

export interface InsightItem {
  id: string;
  projectId: string;
  noteId: string;
  extractionRunId: string;
  type: string;
  title: string;
  summary: string;
  confidence: number;
  urgency?: string;
  reviewStatus: string;
  evidence: InsightEvidence[];
  createdAt: string;
  updatedAt: string;
}

export interface ExtractionRun {
  id: string;
  projectId: string;
  noteId: string;
  status: string;
  provider: string;
  model: string;
  promptVersion: string;
  schemaVersion: string;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExtractionResult {
  run: ExtractionRun;
  insights: InsightItem[];
}

export function runMockExtraction(noteId: string): Promise<ExtractionResult> {
  return requestJson<ExtractionResult>(`/api/notes/${noteId}/extract`, {
    method: 'POST'
  });
}

export function listNoteInsights(noteId: string): Promise<InsightItem[]> {
  return requestJson<InsightItem[]>(`/api/notes/${noteId}/insights`);
}

export function getExtractionRun(runId: string): Promise<ExtractionRun> {
  return requestJson<ExtractionRun>(`/api/extraction-runs/${runId}`);
}
