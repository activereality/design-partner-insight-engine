import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  buildProjectDashboardAggregation,
  DashboardSourceInsight
} from './dashboard-aggregation';
import { ProjectDashboardResponse } from './dashboard.response';
import { InsightItem } from '../insights/schemas/insight-item.schema';
import { ResearchNote } from '../notes/schemas/research-note.schema';
import { toProjectResponse } from '../projects/project.response';
import { Project } from '../projects/schemas/project.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    @InjectModel(ResearchNote.name) private readonly noteModel: Model<ResearchNote>,
    @InjectModel(InsightItem.name) private readonly insightModel: Model<InsightItem>
  ) {}

  async getProjectDashboard(projectId: string): Promise<ProjectDashboardResponse> {
    const project = await this.projectModel.findById(projectId).exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const projectObjectId = new Types.ObjectId(projectId);
    const [noteCount, insights] = await Promise.all([
      this.noteModel.countDocuments({ projectId: projectObjectId }).exec(),
      this.insightModel
        .find({ projectId: projectObjectId })
        .sort({ confidence: -1, createdAt: -1 })
        .exec()
    ]);

    const sourceInsights: DashboardSourceInsight[] = insights.map((insight) => ({
      id: insight._id.toString(),
      noteId: insight.noteId.toString(),
      type: insight.type,
      title: insight.title,
      summary: insight.summary,
      confidence: insight.confidence,
      ...(insight.urgency ? { urgency: insight.urgency } : {}),
      reviewStatus: insight.reviewStatus,
      evidence: insight.evidence.map((item) => ({
        noteId: item.noteId,
        snippet: item.snippet,
        source: item.source
      })),
      payload: insight.payload,
      createdAt: insight.createdAt.toISOString(),
      updatedAt: insight.updatedAt.toISOString()
    }));

    return {
      project: toProjectResponse(project),
      noteCount,
      insightCount: insights.length,
      ...buildProjectDashboardAggregation(sourceInsights)
    };
  }
}
