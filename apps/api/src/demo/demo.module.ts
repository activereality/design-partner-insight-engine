import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';
import { ExtractionRun, ExtractionRunSchema } from '../extraction-runs/schemas/extraction-run.schema';
import { MockExtractionService } from '../extraction-runs/mock-extraction.service';
import { InsightItem, InsightItemSchema } from '../insights/schemas/insight-item.schema';
import { ResearchNote, ResearchNoteSchema } from '../notes/schemas/research-note.schema';
import { Project, ProjectSchema } from '../projects/schemas/project.schema';

@Module({
  controllers: [DemoController],
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: ResearchNote.name, schema: ResearchNoteSchema },
      { name: ExtractionRun.name, schema: ExtractionRunSchema },
      { name: InsightItem.name, schema: InsightItemSchema }
    ])
  ],
  providers: [DemoService, MockExtractionService]
})
export class DemoModule {}
