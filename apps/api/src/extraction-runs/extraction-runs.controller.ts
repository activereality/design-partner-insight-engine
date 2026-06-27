import { Controller, Get, Param, Post } from '@nestjs/common';

import { MongoObjectIdPipe } from '../common/pipes/mongo-object-id.pipe';
import {
  ExtractionResultResponse,
  ExtractionRunsService
} from './extraction-runs.service';
import { ExtractionRunResponse } from './extraction-run.response';

@Controller()
export class ExtractionRunsController {
  constructor(private readonly extractionRunsService: ExtractionRunsService) {}

  @Get('extraction-runs/:runId')
  findOne(@Param('runId', MongoObjectIdPipe) runId: string): Promise<ExtractionRunResponse> {
    return this.extractionRunsService.findOne(runId);
  }

  @Post('notes/:noteId/extract')
  extractNote(
    @Param('noteId', MongoObjectIdPipe) noteId: string
  ): Promise<ExtractionResultResponse> {
    return this.extractionRunsService.extractNote(noteId);
  }
}
