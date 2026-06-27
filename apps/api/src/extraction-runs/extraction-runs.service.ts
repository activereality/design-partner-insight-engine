import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { InsightItem } from '../insights/schemas/insight-item.schema';
import { ResearchNote, ResearchNoteDocument } from '../notes/schemas/research-note.schema';
import { ExtractionRunResponse, toExtractionRunResponse } from './extraction-run.response';
import { ExtractionProvider } from './enums/extraction-provider.enum';
import { ExtractionRunStatus } from './enums/extraction-run-status.enum';
import { MockExtractionService } from './mock-extraction.service';
import { ExtractionRun, ExtractionRunDocument } from './schemas/extraction-run.schema';
import { InsightItemResponse, toInsightItemResponse } from '../insights/insight-item.response';

const MOCK_MODEL = 'mock-design-partner-extractor';
const PROMPT_VERSION = 'mock_prompt.v1';
const SCHEMA_VERSION = 'design_partner_extraction.v1';

export interface ExtractionResultResponse {
  run: ExtractionRunResponse;
  insights: InsightItemResponse[];
}

@Injectable()
export class ExtractionRunsService {
  constructor(
    @InjectModel(ExtractionRun.name) private readonly runModel: Model<ExtractionRun>,
    @InjectModel(InsightItem.name) private readonly insightModel: Model<InsightItem>,
    @InjectModel(ResearchNote.name) private readonly noteModel: Model<ResearchNote>,
    private readonly mockExtractionService: MockExtractionService
  ) {}

  async findOne(runId: string): Promise<ExtractionRunResponse> {
    const run = await this.findRunDocument(runId);
    return toExtractionRunResponse(run);
  }

  async extractNote(noteId: string): Promise<ExtractionResultResponse> {
    const note = await this.findNoteDocument(noteId);
    const now = new Date();
    const run = await this.runModel.create({
      projectId: note.projectId,
      noteId: note._id,
      status: ExtractionRunStatus.Running,
      provider: ExtractionProvider.Mock,
      model: MOCK_MODEL,
      promptVersion: PROMPT_VERSION,
      schemaVersion: SCHEMA_VERSION,
      startedAt: now
    });

    try {
      const drafts = this.mockExtractionService.extract(note);
      const createdInsights = await this.insightModel.insertMany(
        drafts.map((draft) => ({
          ...draft,
          projectId: note.projectId,
          noteId: note._id,
          extractionRunId: run._id
        }))
      );

      const updatedRun = await this.runModel
        .findByIdAndUpdate(
          run._id,
          {
            completedAt: new Date(),
            rawResponse: {
              insightCount: createdInsights.length,
              kind: 'mock_metadata',
              noteTitle: note.title
            },
            status: ExtractionRunStatus.Succeeded
          },
          { new: true, runValidators: true }
        )
        .exec();

      if (!updatedRun) {
        throw new NotFoundException('Extraction run not found');
      }

      return {
        run: toExtractionRunResponse(updatedRun),
        insights: createdInsights.map(toInsightItemResponse)
      };
    } catch (error) {
      await this.runModel
        .findByIdAndUpdate(run._id, {
          completedAt: new Date(),
          errorMessage: 'Mock extraction failed',
          status: ExtractionRunStatus.Failed
        })
        .exec();

      throw error;
    }
  }

  private async findRunDocument(runId: string): Promise<ExtractionRunDocument> {
    const run = await this.runModel.findById(runId).exec();

    if (!run) {
      throw new NotFoundException('Extraction run not found');
    }

    return run;
  }

  private async findNoteDocument(noteId: string): Promise<ResearchNoteDocument> {
    const note = await this.noteModel.findById(new Types.ObjectId(noteId)).exec();

    if (!note) {
      throw new NotFoundException('Research note not found');
    }

    return note;
  }
}
