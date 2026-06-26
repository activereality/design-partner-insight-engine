import { ResearchNoteDocument } from './schemas/research-note.schema';

export interface ResearchNoteResponse {
  id: string;
  projectId: string;
  title: string;
  sourceType: string;
  participantLabel: string;
  rawText: string;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
}

export function toResearchNoteResponse(note: ResearchNoteDocument): ResearchNoteResponse {
  return {
    id: note._id.toString(),
    projectId: note.projectId.toString(),
    title: note.title,
    sourceType: note.sourceType,
    participantLabel: note.participantLabel,
    rawText: note.rawText,
    occurredAt: note.occurredAt.toISOString(),
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString()
  };
}
