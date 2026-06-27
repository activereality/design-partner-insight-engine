import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { MongoObjectIdPipe } from '../common/pipes/mongo-object-id.pipe';
import { UpdateInsightDto } from './dto/update-insight.dto';
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

  @Post('insights/:insightId/accept')
  accept(@Param('insightId', MongoObjectIdPipe) insightId: string): Promise<InsightItemResponse> {
    return this.insightsService.accept(insightId);
  }

  @Post('insights/:insightId/reject')
  reject(@Param('insightId', MongoObjectIdPipe) insightId: string): Promise<InsightItemResponse> {
    return this.insightsService.reject(insightId);
  }

  @Post('insights/:insightId/needs-follow-up')
  needsFollowUp(
    @Param('insightId', MongoObjectIdPipe) insightId: string
  ): Promise<InsightItemResponse> {
    return this.insightsService.needsFollowUp(insightId);
  }

  @Patch('insights/:insightId')
  update(
    @Param('insightId', MongoObjectIdPipe) insightId: string,
    @Body() dto: UpdateInsightDto
  ): Promise<InsightItemResponse> {
    return this.insightsService.update(insightId, dto);
  }
}
