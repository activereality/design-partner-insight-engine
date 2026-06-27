import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MockInsightExtractionProvider } from './mock-insight-extraction.provider';
import { OpenAiInsightExtractionProvider } from './openai-insight-extraction.provider';
import { SelectedExtractionProvider } from './insight-extraction-provider';

@Injectable()
export class InsightExtractionProviderSelector {
  constructor(
    private readonly configService: ConfigService,
    private readonly mockProvider: MockInsightExtractionProvider,
    private readonly openAiProvider: OpenAiInsightExtractionProvider
  ) {}

  select(): SelectedExtractionProvider {
    const provider = this.configService.get<'mock' | 'openai'>('AI_PROVIDER') ?? 'mock';

    if (provider === 'openai') {
      return this.openAiProvider;
    }

    return this.mockProvider;
  }
}
