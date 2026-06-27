import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InsightItem, InsightItemSchema } from '../insights/schemas/insight-item.schema';
import { ResearchNote, ResearchNoteSchema } from '../notes/schemas/research-note.schema';
import { ExtractionRunsController } from './extraction-runs.controller';
import { ExtractionRunsService } from './extraction-runs.service';
import { MockExtractionService } from './mock-extraction.service';
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
  providers: [ExtractionRunsService, MockExtractionService]
})
export class ExtractionRunsModule {}
