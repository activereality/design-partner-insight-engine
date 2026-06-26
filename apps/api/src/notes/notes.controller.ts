import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';

import { MongoObjectIdPipe } from '../common/pipes/mongo-object-id.pipe';
import { CreateResearchNoteDto } from './dto/create-research-note.dto';
import { UpdateResearchNoteDto } from './dto/update-research-note.dto';
import { NotesService } from './notes.service';
import { ResearchNoteDetailResponse, ResearchNoteSummaryResponse } from './research-note.response';

@Controller()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('projects/:projectId/notes')
  findByProject(
    @Param('projectId', MongoObjectIdPipe) projectId: string
  ): Promise<ResearchNoteSummaryResponse[]> {
    return this.notesService.findByProject(projectId);
  }

  @Post('projects/:projectId/notes')
  create(
    @Param('projectId', MongoObjectIdPipe) projectId: string,
    @Body() dto: CreateResearchNoteDto
  ): Promise<ResearchNoteSummaryResponse> {
    return this.notesService.create(projectId, dto);
  }

  @Get('notes/:noteId')
  findOne(@Param('noteId', MongoObjectIdPipe) noteId: string): Promise<ResearchNoteDetailResponse> {
    return this.notesService.findOne(noteId);
  }

  @Patch('notes/:noteId')
  update(
    @Param('noteId', MongoObjectIdPipe) noteId: string,
    @Body() dto: UpdateResearchNoteDto
  ): Promise<ResearchNoteDetailResponse> {
    return this.notesService.update(noteId, dto);
  }

  @Delete('notes/:noteId')
  @HttpCode(204)
  delete(@Param('noteId', MongoObjectIdPipe) noteId: string): Promise<void> {
    return this.notesService.delete(noteId);
  }
}
