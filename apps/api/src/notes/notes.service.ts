import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ProjectsService } from '../projects/projects.service';
import { CreateResearchNoteDto } from './dto/create-research-note.dto';
import { UpdateResearchNoteDto } from './dto/update-research-note.dto';
import { ResearchNoteResponse, toResearchNoteResponse } from './research-note.response';
import { ResearchNote, ResearchNoteDocument } from './schemas/research-note.schema';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(ResearchNote.name) private readonly noteModel: Model<ResearchNote>,
    private readonly projectsService: ProjectsService
  ) {}

  async create(projectId: string, dto: CreateResearchNoteDto): Promise<ResearchNoteResponse> {
    await this.projectsService.ensureExists(projectId);

    const note = await this.noteModel.create({
      projectId: new Types.ObjectId(projectId),
      title: dto.title,
      sourceType: dto.sourceType,
      participantLabel: dto.participantLabel,
      rawText: dto.rawText,
      occurredAt: new Date(dto.occurredAt)
    });

    return toResearchNoteResponse(note);
  }

  async findByProject(projectId: string): Promise<ResearchNoteResponse[]> {
    await this.projectsService.ensureExists(projectId);

    const notes = await this.noteModel
      .find({ projectId: new Types.ObjectId(projectId) })
      .sort({ occurredAt: -1 })
      .exec();
    return notes.map(toResearchNoteResponse);
  }

  async findOne(noteId: string): Promise<ResearchNoteResponse> {
    const note = await this.findNoteDocument(noteId);
    return toResearchNoteResponse(note);
  }

  async update(noteId: string, dto: UpdateResearchNoteDto): Promise<ResearchNoteResponse> {
    const update = { ...dto };

    if (dto.occurredAt) {
      update.occurredAt = new Date(dto.occurredAt).toISOString();
    }

    const note = await this.noteModel
      .findByIdAndUpdate(noteId, update, { new: true, runValidators: true })
      .exec();

    if (!note) {
      throw new NotFoundException('Research note not found');
    }

    return toResearchNoteResponse(note);
  }

  async delete(noteId: string): Promise<void> {
    const result = await this.noteModel.findByIdAndDelete(noteId).exec();

    if (!result) {
      throw new NotFoundException('Research note not found');
    }
  }

  private async findNoteDocument(noteId: string): Promise<ResearchNoteDocument> {
    const note = await this.noteModel.findById(noteId).exec();

    if (!note) {
      throw new NotFoundException('Research note not found');
    }

    return note;
  }
}
