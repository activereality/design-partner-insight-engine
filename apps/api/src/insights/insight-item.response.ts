import { InsightEvidence, InsightItemDocument } from './schemas/insight-item.schema';

export interface InsightItemResponse {
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

export function toInsightItemResponse(insight: InsightItemDocument): InsightItemResponse {
  return {
    id: insight._id.toString(),
    projectId: insight.projectId.toString(),
    noteId: insight.noteId.toString(),
    extractionRunId: insight.extractionRunId.toString(),
    type: insight.type,
    title: insight.title,
    summary: insight.summary,
    confidence: insight.confidence,
    ...(insight.urgency ? { urgency: insight.urgency } : {}),
    reviewStatus: insight.reviewStatus,
    ...(insight.reviewedAt ? { reviewedAt: insight.reviewedAt.toISOString() } : {}),
    ...(insight.editedAt ? { editedAt: insight.editedAt.toISOString() } : {}),
    ...(insight.reviewNotes ? { reviewNotes: insight.reviewNotes } : {}),
    evidence: insight.evidence.map((item) => ({
      noteId: item.noteId,
      snippet: item.snippet,
      source: item.source
    })),
    createdAt: insight.createdAt.toISOString(),
    updatedAt: insight.updatedAt.toISOString()
  };
}
