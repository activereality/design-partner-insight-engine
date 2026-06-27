import { ExtractionRunDocument } from './schemas/extraction-run.schema';

export interface ExtractionRunResponse {
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

export function toExtractionRunResponse(run: ExtractionRunDocument): ExtractionRunResponse {
  return {
    id: run._id.toString(),
    projectId: run.projectId.toString(),
    noteId: run.noteId.toString(),
    status: run.status,
    provider: run.provider,
    model: run.model,
    promptVersion: run.promptVersion,
    schemaVersion: run.schemaVersion,
    startedAt: run.startedAt.toISOString(),
    ...(run.completedAt ? { completedAt: run.completedAt.toISOString() } : {}),
    ...(run.errorMessage ? { errorMessage: run.errorMessage } : {}),
    createdAt: run.createdAt.toISOString(),
    updatedAt: run.updatedAt.toISOString()
  };
}
