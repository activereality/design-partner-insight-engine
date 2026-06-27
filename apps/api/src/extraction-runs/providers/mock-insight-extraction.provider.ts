import { Injectable } from '@nestjs/common';

import {
  DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION,
  MOCK_EXTRACTION_MODEL,
  MOCK_EXTRACTION_PROMPT_VERSION
} from '../design-partner-extraction.contract';
import { ExtractionProvider } from '../enums/extraction-provider.enum';
import {
  ExtractInsightsInput,
  SelectedExtractionProvider
} from './insight-extraction-provider';
import { MockExtractionService } from '../mock-extraction.service';

@Injectable()
export class MockInsightExtractionProvider implements SelectedExtractionProvider {
  readonly model = MOCK_EXTRACTION_MODEL;
  readonly provider = ExtractionProvider.Mock;
  readonly promptVersion = MOCK_EXTRACTION_PROMPT_VERSION;
  readonly schemaVersion = DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION;

  constructor(private readonly mockExtractionService: MockExtractionService) {}

  async extract(input: ExtractInsightsInput) {
    return this.mockExtractionService.extract(input.note);
  }
}
