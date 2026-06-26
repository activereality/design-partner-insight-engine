import { requestJson } from './client';

export const noteSourceTypes = [
  'interview',
  'design_partner_call',
  'founder_notes',
  'sales_call',
  'internal_synthesis',
  'other'
] as const;

export type NoteSourceType = (typeof noteSourceTypes)[number];

export interface ResearchNote {
  id: string;
  projectId: string;
  title: string;
  sourceType: NoteSourceType;
  participantLabel: string;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
  rawTextPreview?: string;
}

export interface ResearchNoteDetail extends ResearchNote {
  rawText: string;
}

export interface CreateResearchNoteInput {
  title: string;
  sourceType: NoteSourceType;
  participantLabel: string;
  rawText: string;
  occurredAt: string;
}

export type UpdateResearchNoteInput = Partial<CreateResearchNoteInput>;

export function listProjectNotes(projectId: string): Promise<ResearchNote[]> {
  return requestJson<ResearchNote[]>(`/api/projects/${projectId}/notes`);
}

export function createProjectNote(
  projectId: string,
  input: CreateResearchNoteInput
): Promise<ResearchNote> {
  return requestJson<ResearchNote>(`/api/projects/${projectId}/notes`, {
    body: JSON.stringify(input),
    method: 'POST'
  });
}

export function getResearchNote(noteId: string): Promise<ResearchNoteDetail> {
  return requestJson<ResearchNoteDetail>(`/api/notes/${noteId}`);
}

export function updateResearchNote(
  noteId: string,
  input: UpdateResearchNoteInput
): Promise<ResearchNoteDetail> {
  return requestJson<ResearchNoteDetail>(`/api/notes/${noteId}`, {
    body: JSON.stringify(input),
    method: 'PATCH'
  });
}

export function deleteResearchNote(noteId: string): Promise<void> {
  return requestJson<void>(`/api/notes/${noteId}`, {
    method: 'DELETE'
  });
}
