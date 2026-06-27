import { Injectable } from '@nestjs/common';

import { InsightReviewStatus } from '../insights/enums/insight-review-status.enum';
import { InsightType } from '../insights/enums/insight-type.enum';
import { InsightEvidence, InsightPayload } from '../insights/schemas/insight-item.schema';
import { ResearchNoteDocument } from '../notes/schemas/research-note.schema';

export interface MockInsightDraft {
  type: InsightType;
  title: string;
  summary: string;
  confidence: number;
  urgency?: string;
  reviewStatus: InsightReviewStatus;
  evidence: InsightEvidence[];
  payload: InsightPayload;
}

@Injectable()
export class MockExtractionService {
  extract(note: ResearchNoteDocument): MockInsightDraft[] {
    const noteId = note._id.toString();
    const participant = note.participantLabel || 'Synthetic participant';
    const sourceLabel = note.sourceType.replace(/_/g, ' ');
    const evidence = this.genericEvidence(noteId, participant, sourceLabel);

    return [
      {
        type: InsightType.PainPoint,
        title: 'Discovery signal needs clearer prioritization',
        summary:
          'The note suggests a product team is collecting useful signal but needs a clearer way to separate urgent pains from background noise.',
        confidence: 0.76,
        urgency: 'medium',
        reviewStatus: InsightReviewStatus.AiGenerated,
        evidence,
        payload: { recommendation: 'compare repeated pains before committing build effort' }
      },
      {
        type: InsightType.UserJob,
        title: 'Synthesize messy notes into next-step decisions',
        summary:
          'A likely job is turning unstructured discovery input into a concise view of what to build, learn, or ignore next.',
        confidence: 0.72,
        urgency: 'medium',
        reviewStatus: InsightReviewStatus.AiGenerated,
        evidence,
        payload: { jobStage: 'post-interview synthesis' }
      },
      {
        type: InsightType.FeatureHypothesis,
        title: 'Evidence-backed insight cards may reduce synthesis time',
        summary:
          'A workflow that groups insights with short evidence snippets could help teams review discovery signal faster.',
        confidence: 0.68,
        reviewStatus: InsightReviewStatus.AiGenerated,
        evidence,
        payload: { expectedOutcome: 'faster human review' }
      },
      {
        type: InsightType.OpenQuestion,
        title: 'Which signal should count as urgent?',
        summary:
          'The next discovery pass should clarify what makes a pain point urgent enough to influence roadmap decisions.',
        confidence: 0.7,
        urgency: 'medium',
        reviewStatus: InsightReviewStatus.AiGenerated,
        evidence,
        payload: { questionType: 'prioritization' }
      },
      {
        type: InsightType.Experiment,
        title: 'Run a small synthesis review with one design partner',
        summary:
          'A practical next experiment is to review generated insight cards with a design partner and measure whether the summary matches their intent.',
        confidence: 0.74,
        urgency: 'low',
        reviewStatus: InsightReviewStatus.AiGenerated,
        evidence,
        payload: { experimentSize: 'small' }
      },
      {
        type: InsightType.DecisionRecommendation,
        title: 'Learn more before treating this as roadmap-ready',
        summary:
          'The safest recommendation is to keep this as a learning signal until more notes confirm the same pattern.',
        confidence: 0.66,
        urgency: 'medium',
        reviewStatus: InsightReviewStatus.AiGenerated,
        evidence,
        payload: { decision: 'learn_more' }
      }
    ];
  }

  private genericEvidence(
    noteId: string,
    participant: string,
    sourceLabel: string
  ): InsightEvidence[] {
    return [
      {
        noteId,
        snippet: `Synthetic evidence from ${participant} via ${sourceLabel}.`,
        source: 'mock_generic'
      }
    ];
  }
}
