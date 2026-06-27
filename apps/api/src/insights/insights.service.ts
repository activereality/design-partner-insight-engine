import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ProjectsService } from '../projects/projects.service';
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

  private async findInsightDocument(insightId: string): Promise<InsightItemDocument> {
    const insight = await this.insightModel.findById(insightId).exec();

    if (!insight) {
      throw new NotFoundException('Insight not found');
    }

    return insight;
  }
}
