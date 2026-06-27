import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { InsightItem, InsightItemSchema } from '../insights/schemas/insight-item.schema';
import { ResearchNote, ResearchNoteSchema } from '../notes/schemas/research-note.schema';
import { Project, ProjectSchema } from '../projects/schemas/project.schema';

@Module({
  controllers: [DashboardController],
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: ResearchNote.name, schema: ResearchNoteSchema },
      { name: InsightItem.name, schema: InsightItemSchema }
    ])
  ],
  providers: [DashboardService]
})
export class DashboardModule {}
