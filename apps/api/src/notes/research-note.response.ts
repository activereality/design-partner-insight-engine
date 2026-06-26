import { ResearchNoteDocument } from './schemas/research-note.schema';

const RAW_TEXT_PREVIEW_LENGTH = 140;

export interface ResearchNoteSummaryResponse {
  id: string;
  projectId: string;
  title: string;
  sourceType: string;
  participantLabel: string;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
  rawTextPreview?: string;
}

export interface ResearchNoteDetailResponse extends ResearchNoteSummaryResponse {
  rawText: string;
}

export function toResearchNoteSummaryResponse(
  note: ResearchNoteDocument
): ResearchNoteSummaryResponse {
  const rawTextPreview = note.rawText.trim().slice(0, RAW_TEXT_PREVIEW_LENGTH);

  return {
    id: note._id.toString(),
    projectId: note.projectId.toString(),
    title: note.title,
    sourceType: note.sourceType,
    participantLabel: note.participantLabel,
    occurredAt: note.occurredAt.toISOString(),
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
    ...(rawTextPreview ? { rawTextPreview } : {})
  };
}

export function toResearchNoteDetailResponse(
  note: ResearchNoteDocument
): ResearchNoteDetailResponse {
  return {
    ...toResearchNoteSummaryResponse(note),
    rawText: note.rawText
  };
}
