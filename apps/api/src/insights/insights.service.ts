import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ProjectsService } from '../projects/projects.service';
import { UpdateInsightDto } from './dto/update-insight.dto';
import { InsightReviewStatus } from './enums/insight-review-status.enum';
import { InsightItemResponse, toInsightItemResponse } from './insight-item.response';
import { InsightItem, InsightItemDocument } from './schemas/insight-item.schema';

@Injectable()
export class InsightsService {
  constructor(
    @InjectModel(InsightItem.name) private readonly insightModel: Model<InsightItem>,
    private readonly projectsService: ProjectsService
  ) {}

  async findByProject(projectId: string): Promise<InsightItemResponse[]> {
    await this.projectsService.ensureExists(projectId);

    const insights = await this.insightModel
      .find({ projectId: new Types.ObjectId(projectId) })
      .sort({ createdAt: -1 })
      .exec();
    return insights.map(toInsightItemResponse);
  }

  async findByNote(noteId: string): Promise<InsightItemResponse[]> {
    const insights = await this.insightModel
      .find({ noteId: new Types.ObjectId(noteId) })
      .sort({ createdAt: -1 })
      .exec();
    return insights.map(toInsightItemResponse);
  }

  async findOne(insightId: string): Promise<InsightItemResponse> {
    const insight = await this.findInsightDocument(insightId);
    return toInsightItemResponse(insight);
  }

  async accept(insightId: string): Promise<InsightItemResponse> {
    return this.setReviewStatus(insightId, InsightReviewStatus.Accepted);
  }

  async reject(insightId: string): Promise<InsightItemResponse> {
    return this.setReviewStatus(insightId, InsightReviewStatus.Rejected);
  }

  async needsFollowUp(insightId: string): Promise<InsightItemResponse> {
    return this.setReviewStatus(insightId, InsightReviewStatus.NeedsFollowUp);
  }

  async update(insightId: string, dto: UpdateInsightDto): Promise<InsightItemResponse> {
    const insight = await this.findInsightDocument(insightId);
    const updates: Partial<InsightItem> = {};
    const now = new Date();
    const editsTitleOrSummary = dto.title !== undefined || dto.summary !== undefined;

    if (dto.title !== undefined) {
      updates.title = dto.title;
      updates.originalTitle = insight.originalTitle ?? insight.title;
    }

    if (dto.summary !== undefined) {
      updates.summary = dto.summary;
      updates.originalSummary = insight.originalSummary ?? insight.summary;
    }

    if (dto.reviewNotes !== undefined) {
      updates.reviewNotes = dto.reviewNotes;
    }

    if (editsTitleOrSummary) {
      updates.editedAt = now;

      if (!this.isFinalReviewStatus(insight.reviewStatus)) {
        updates.reviewStatus = InsightReviewStatus.Edited;
      }
    }

    const updated = await this.insightModel
      .findByIdAndUpdate(insight._id, updates, { new: true, runValidators: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Insight not found');
    }

    return toInsightItemResponse(updated);
  }

  private async findInsightDocument(insightId: string): Promise<InsightItemDocument> {
    const insight = await this.insightModel.findById(insightId).exec();

    if (!insight) {
      throw new NotFoundException('Insight not found');
    }

    return insight;
  }

  private async setReviewStatus(
    insightId: string,
    reviewStatus: InsightReviewStatus
  ): Promise<InsightItemResponse> {
    const insight = await this.insightModel
      .findByIdAndUpdate(
        insightId,
        {
          reviewedAt: new Date(),
          reviewStatus
        },
        { new: true, runValidators: true }
      )
      .exec();

    if (!insight) {
      throw new NotFoundException('Insight not found');
    }

    return toInsightItemResponse(insight);
  }

  private isFinalReviewStatus(reviewStatus: InsightReviewStatus): boolean {
    return [
      InsightReviewStatus.Accepted,
      InsightReviewStatus.Rejected,
      InsightReviewStatus.NeedsFollowUp
    ].includes(reviewStatus);
  }
}
