import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InsightItem, InsightItemSchema } from '../insights/schemas/insight-item.schema';
import { ResearchNote, ResearchNoteSchema } from '../notes/schemas/research-note.schema';
import { ExtractionRunsController } from './extraction-runs.controller';
import { ExtractionRunsService } from './extraction-runs.service';
import { MockExtractionService } from './mock-extraction.service';
import { InsightExtractionProviderSelector } from './providers/insight-extraction-provider.selector';
import { MockInsightExtractionProvider } from './providers/mock-insight-extraction.provider';
import { OpenAiInsightExtractionProvider } from './providers/openai-insight-extraction.provider';
import { ExtractionRun, ExtractionRunSchema } from './schemas/extraction-run.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExtractionRun.name, schema: ExtractionRunSchema },
      { name: InsightItem.name, schema: InsightItemSchema },
      { name: ResearchNote.name, schema: ResearchNoteSchema }
    ])
  ],
  controllers: [ExtractionRunsController],
  providers: [
    ExtractionRunsService,
    MockExtractionService,
    MockInsightExtractionProvider,
    OpenAiInsightExtractionProvider,
    InsightExtractionProviderSelector
  ]
})
export class ExtractionRunsModule {}
