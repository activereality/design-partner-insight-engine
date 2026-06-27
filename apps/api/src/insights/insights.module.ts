import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProjectsModule } from '../projects/projects.module';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';
import { InsightItem, InsightItemSchema } from './schemas/insight-item.schema';

@Module({
  imports: [
    ProjectsModule,
    MongooseModule.forFeature([{ name: InsightItem.name, schema: InsightItemSchema }])
  ],
  controllers: [InsightsController],
  providers: [InsightsService],
  exports: [MongooseModule]
})
export class InsightsModule {}
