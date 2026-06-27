import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { InsightItem } from '../insights/schemas/insight-item.schema';
import { ResearchNote, ResearchNoteDocument } from '../notes/schemas/research-note.schema';
import {
  DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION,
  ExtractionValidationError,
  MOCK_EXTRACTION_MODEL,
  MOCK_EXTRACTION_PROMPT_VERSION,
  parseDesignPartnerExtraction
} from './design-partner-extraction.contract';
import { mapExtractionToInsightDrafts } from './design-partner-extraction.mapper';
import { ExtractionRunResponse, toExtractionRunResponse } from './extraction-run.response';
import { ExtractionRunStatus } from './enums/extraction-run-status.enum';
import { InsightExtractionProviderSelector } from './providers/insight-extraction-provider.selector';
import { ExtractionRun, ExtractionRunDocument } from './schemas/extraction-run.schema';
import { InsightItemResponse, toInsightItemResponse } from '../insights/insight-item.response';

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
    private readonly providerSelector: InsightExtractionProviderSelector
  ) {}

  async findOne(runId: string): Promise<ExtractionRunResponse> {
    const run = await this.findRunDocument(runId);
    return toExtractionRunResponse(run);
  }

  async extractNote(noteId: string): Promise<ExtractionResultResponse> {
    const note = await this.findNoteDocument(noteId);
    const provider = this.providerSelector.select();
    const now = new Date();
    const run = await this.runModel.create({
      projectId: note.projectId,
      noteId: note._id,
      status: ExtractionRunStatus.Running,
      provider: provider.provider,
      model: provider.model,
      promptVersion: provider.promptVersion,
      schemaVersion: provider.schemaVersion,
      startedAt: now
    });

    try {
      const extraction = parseDesignPartnerExtraction(await provider.extract({ note }));
      const drafts = mapExtractionToInsightDrafts(extraction, note._id.toString());
      const createdInsights = await this.insightModel.insertMany(
        drafts.map((draft) => ({
          ...draft,
          projectId: note.projectId,
          noteId: note._id,
          extractionRunId: run._id,
          originalTitle: draft.title,
          originalSummary: draft.summary
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
              schemaVersion: extraction.schemaVersion
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
          errorMessage:
            error instanceof ExtractionValidationError
              ? 'Extraction output failed validation'
              : 'Mock extraction failed',
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
