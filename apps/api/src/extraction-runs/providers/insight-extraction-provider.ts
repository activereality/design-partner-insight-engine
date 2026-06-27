import { DesignPartnerExtraction } from '../design-partner-extraction.contract';
import { ExtractionProvider } from '../enums/extraction-provider.enum';
import { ResearchNoteDocument } from '../../notes/schemas/research-note.schema';

export interface ExtractInsightsInput {
  note: ResearchNoteDocument;
}

export interface SelectedExtractionProvider {
  model: string;
  provider: ExtractionProvider;
  promptVersion: string;
  schemaVersion: string;
  extract(input: ExtractInsightsInput): Promise<DesignPartnerExtraction>;
}
