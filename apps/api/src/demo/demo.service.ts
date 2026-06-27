import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { DEMO_DASHBOARD_PATH, DEMO_KEY, demoNotes, demoProject } from './demo-data';
import { DemoResetResponse, DemoSeedResponse } from './demo.response';
import {
  DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION,
  MOCK_EXTRACTION_MODEL,
  MOCK_EXTRACTION_PROMPT_VERSION
} from '../extraction-runs/design-partner-extraction.contract';
import { mapExtractionToInsightDrafts } from '../extraction-runs/design-partner-extraction.mapper';
import { ExtractionProvider } from '../extraction-runs/enums/extraction-provider.enum';
import { ExtractionRunStatus } from '../extraction-runs/enums/extraction-run-status.enum';
import { MockExtractionService } from '../extraction-runs/mock-extraction.service';
import { ExtractionRun } from '../extraction-runs/schemas/extraction-run.schema';
import { InsightReviewStatus } from '../insights/enums/insight-review-status.enum';
import { InsightType } from '../insights/enums/insight-type.enum';
import { InsightItem, InsightPayload } from '../insights/schemas/insight-item.schema';
import { ResearchNote, ResearchNoteDocument } from '../notes/schemas/research-note.schema';
import { Project } from '../projects/schemas/project.schema';

@Injectable()
export class DemoService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    @InjectModel(ResearchNote.name) private readonly noteModel: Model<ResearchNote>,
    @InjectModel(ExtractionRun.name) private readonly runModel: Model<ExtractionRun>,
    @InjectModel(InsightItem.name) private readonly insightModel: Model<InsightItem>,
    private readonly mockExtractionService: MockExtractionService
  ) {}

  async seed(): Promise<DemoSeedResponse> {
    this.ensureDemoToolsEnabled();
    await this.resetDemoData();

    const project = await this.projectModel.create(demoProject);
    const notes = await this.noteModel.insertMany(
      demoNotes.map((note) => ({
        ...note,
        occurredAt: new Date(note.occurredAt),
        projectId: project._id
      }))
    );

    let insightCount = 0;

    for (const [noteIndex, note] of notes.entries()) {
      insightCount += await this.seedNoteExtraction(project._id, note, noteIndex);
    }

    return {
      dashboardPath: DEMO_DASHBOARD_PATH.replace(':projectId', project._id.toString()),
      insightCount,
      noteCount: notes.length,
      projectId: project._id.toString()
    };
  }

  async reset(): Promise<DemoResetResponse> {
    this.ensureDemoToolsEnabled();
    return this.resetDemoData();
  }

  private async resetDemoData(): Promise<DemoResetResponse> {
    const demoProjects = await this.projectModel
      .find({ demoKey: DEMO_KEY, isDemo: true })
      .select({ _id: 1 })
      .exec();
    const projectIds = demoProjects.map((project) => project._id);

    if (projectIds.length === 0) {
      return {
        deletedExtractionRuns: 0,
        deletedInsights: 0,
        deletedNotes: 0,
        deletedProjects: 0
      };
    }

    const [insights, extractionRuns, notes, projects] = await Promise.all([
      this.insightModel.deleteMany({ projectId: { $in: projectIds } }).exec(),
      this.runModel.deleteMany({ projectId: { $in: projectIds } }).exec(),
      this.noteModel.deleteMany({ projectId: { $in: projectIds } }).exec(),
      this.projectModel.deleteMany({ _id: { $in: projectIds }, demoKey: DEMO_KEY, isDemo: true }).exec()
    ]);

    return {
      deletedExtractionRuns: extractionRuns.deletedCount,
      deletedInsights: insights.deletedCount,
      deletedNotes: notes.deletedCount,
      deletedProjects: projects.deletedCount
    };
  }

  private async seedNoteExtraction(
    projectId: Types.ObjectId,
    note: ResearchNoteDocument,
    noteIndex: number
  ): Promise<number> {
    const now = new Date();
    const extraction = this.mockExtractionService.extract(note);
    const drafts = mapExtractionToInsightDrafts(extraction, note._id.toString());
    const run = await this.runModel.create({
      completedAt: now,
      model: MOCK_EXTRACTION_MODEL,
      noteId: note._id,
      projectId,
      promptVersion: MOCK_EXTRACTION_PROMPT_VERSION,
      provider: ExtractionProvider.Mock,
      rawResponse: {
        insightCount: drafts.length + (noteIndex === 0 ? 2 : 0),
        kind: 'mock_metadata',
        schemaVersion: DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION
      },
      schemaVersion: DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION,
      startedAt: now,
      status: ExtractionRunStatus.Succeeded
    });

    const insights: Array<Record<string, unknown>> = drafts.map((draft) => {
      const reviewStatus = this.reviewStatusFor(draft.type, noteIndex);
      const reviewedAt = this.reviewedAtFor(reviewStatus);
      const title =
        reviewStatus === InsightReviewStatus.Edited
          ? `Edited demo signal: ${draft.title}`
          : draft.title;
      const summary =
        reviewStatus === InsightReviewStatus.Edited
          ? `${draft.summary} Human review narrowed this into a dashboard-ready demo signal.`
          : draft.summary;

      return {
        ...draft,
        extractionRunId: run._id,
        noteId: note._id,
        originalSummary: draft.summary,
        originalTitle: draft.title,
        projectId,
        reviewStatus,
        summary,
        title,
        ...(reviewStatus === InsightReviewStatus.Edited ? { editedAt: now } : {}),
        ...(reviewStatus === InsightReviewStatus.Edited
          ? { reviewNotes: 'Synthetic reviewer note: keep this as a concise dashboard signal.' }
          : {}),
        ...(reviewedAt ? { reviewedAt } : {})
      };
    });

    if (noteIndex === 0) {
      insights.push(
        this.extraDecisionInsight({
          decision: 'build_now',
          extractionRunId: run._id,
          note,
          projectId,
          reviewStatus: InsightReviewStatus.Accepted,
          summary:
            'Start with a shared onboarding checklist that shows missing setup information and task ownership.',
          title: 'Build the shared onboarding checklist first'
        }),
        this.extraDecisionInsight({
          decision: 'ignore_for_now',
          extractionRunId: run._id,
          note,
          projectId,
          reviewStatus: InsightReviewStatus.Edited,
          summary:
            'Defer broader workflow automation until the checklist pilot proves repeated follow-ups are reduced.',
          title: 'Defer broad automation beyond the checklist'
        })
      );
    }

    const created = await this.insightModel.insertMany(insights);
    return created.length;
  }

  private extraDecisionInsight({
    decision,
    extractionRunId,
    note,
    projectId,
    reviewStatus,
    summary,
    title
  }: {
    decision: 'build_now' | 'learn_more' | 'ignore_for_now';
    extractionRunId: Types.ObjectId;
    note: ResearchNoteDocument;
    projectId: Types.ObjectId;
    reviewStatus: InsightReviewStatus;
    summary: string;
    title: string;
  }): Record<string, unknown> {
    const now = new Date();
    const payload: InsightPayload = {
      category: 'decisionRecommendations',
      confidenceLabel: 'medium',
      decision,
      directlyStated: false,
      evidenceStrength: 'moderate',
      whyItMatters: 'Synthetic demo evidence connects the recommendation to onboarding discovery signal.'
    };

    return {
      confidence: 0.75,
      evidence: [
        {
          noteId: note._id.toString(),
          snippet: 'Synthetic evidence: repeated follow-up messages and unclear ownership slow onboarding.',
          source: 'mock_generic'
        }
      ],
      extractionRunId,
      noteId: note._id,
      originalSummary: summary,
      originalTitle: title,
      payload,
      projectId,
      reviewedAt: now,
      reviewStatus,
      summary,
      title,
      type: InsightType.DecisionRecommendation,
      ...(reviewStatus === InsightReviewStatus.Edited ? { editedAt: now } : {}),
      ...(reviewStatus === InsightReviewStatus.Edited
        ? {
            reviewNotes:
              'Synthetic reviewer note: keep this deferred for the demo recommendation split.'
          }
        : {})
    };
  }

  private reviewStatusFor(type: InsightType, noteIndex: number): InsightReviewStatus {
    if (type === InsightType.Persona && noteIndex === 2) {
      return InsightReviewStatus.Rejected;
    }

    if (type === InsightType.OpenQuestion) {
      return InsightReviewStatus.NeedsFollowUp;
    }

    if (type === InsightType.FeatureHypothesis || type === InsightType.Experiment) {
      return InsightReviewStatus.Edited;
    }

    if (type === InsightType.UserJob || type === InsightType.PainPoint) {
      return InsightReviewStatus.Accepted;
    }

    return noteIndex === 1 ? InsightReviewStatus.AiGenerated : InsightReviewStatus.Accepted;
  }

  private reviewedAtFor(reviewStatus: InsightReviewStatus): Date | undefined {
    return reviewStatus === InsightReviewStatus.AiGenerated ? undefined : new Date();
  }

  private ensureDemoToolsEnabled(): void {
    const demoToolsEnabled = this.configService.get<boolean>('DEMO_TOOLS_ENABLED') === true;
    const nodeEnv = this.configService.get<string>('NODE_ENV');

    if (!demoToolsEnabled || nodeEnv === 'production') {
      throw new NotFoundException('Demo tools are disabled');
    }
  }
}
