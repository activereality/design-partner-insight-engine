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
  reviewedAt?: string;
  editedAt?: string;
  reviewNotes?: string;
  evidence: InsightEvidence[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateInsightInput {
  title?: string;
  summary?: string;
  reviewNotes?: string;
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

export function runExtraction(noteId: string): Promise<ExtractionResult> {
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

export function acceptInsight(insightId: string): Promise<InsightItem> {
  return requestJson<InsightItem>(`/api/insights/${insightId}/accept`, {
    method: 'POST'
  });
}

export function rejectInsight(insightId: string): Promise<InsightItem> {
  return requestJson<InsightItem>(`/api/insights/${insightId}/reject`, {
    method: 'POST'
  });
}

export function markInsightNeedsFollowUp(insightId: string): Promise<InsightItem> {
  return requestJson<InsightItem>(`/api/insights/${insightId}/needs-follow-up`, {
    method: 'POST'
  });
}

export function updateInsight(insightId: string, input: UpdateInsightInput): Promise<InsightItem> {
  return requestJson<InsightItem>(`/api/insights/${insightId}`, {
    body: JSON.stringify(input),
    method: 'PATCH'
  });
}
