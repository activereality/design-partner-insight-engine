import { Controller, Get, Param } from '@nestjs/common';

import { MongoObjectIdPipe } from '../common/pipes/mongo-object-id.pipe';
import { InsightItemResponse } from './insight-item.response';
import { InsightsService } from './insights.service';

@Controller()
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get('projects/:projectId/insights')
  findByProject(
    @Param('projectId', MongoObjectIdPipe) projectId: string
  ): Promise<InsightItemResponse[]> {
    return this.insightsService.findByProject(projectId);
  }

  @Get('notes/:noteId/insights')
  findByNote(@Param('noteId', MongoObjectIdPipe) noteId: string): Promise<InsightItemResponse[]> {
    return this.insightsService.findByNote(noteId);
  }

  @Get('insights/:insightId')
  findOne(
    @Param('insightId', MongoObjectIdPipe) insightId: string
  ): Promise<InsightItemResponse> {
    return this.insightsService.findOne(insightId);
  }
}
