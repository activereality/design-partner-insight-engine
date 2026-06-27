import { Injectable } from '@nestjs/common';

import { ResearchNoteDocument } from '../notes/schemas/research-note.schema';
import {
  DesignPartnerExtraction,
  DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION,
  ExtractionEvidence
} from './design-partner-extraction.contract';

@Injectable()
export class MockExtractionService {
  extract(note: ResearchNoteDocument): DesignPartnerExtraction {
    const participant = note.participantLabel || 'Synthetic participant';
    const sourceLabel = note.sourceType.replace(/_/g, ' ');
    const evidence = this.genericEvidence(participant, sourceLabel);

    return {
      schemaVersion: DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION,
      noteSummary:
        'Synthetic mock summary: product-discovery signal needs structured review before roadmap action.',
      personas: [
        {
          title: 'Product-minded founder or early product lead',
          summary:
            'The source appears to represent someone trying to turn discovery input into clearer product decisions.',
          evidence,
          confidence: 'medium',
          evidenceStrength: 'moderate',
          directlyStated: false,
          segment: 'early-stage product team'
        }
      ],
      userJobs: [
        {
          title: 'Synthesize messy notes into next-step decisions',
          summary:
            'A likely job is turning unstructured discovery input into a concise view of what to build, learn, or ignore next.',
          evidence,
          confidence: 'medium',
          evidenceStrength: 'moderate',
          directlyStated: false,
          jobStatement: 'When reviewing discovery notes, synthesize signal into decision-ready next steps.'
        }
      ],
      painPoints: [
        {
          title: 'Discovery signal needs clearer prioritization',
          summary:
            'The note suggests a product team is collecting useful signal but needs a clearer way to separate urgent pains from background noise.',
          evidence,
          confidence: 'high',
          evidenceStrength: 'moderate',
          directlyStated: false,
          urgency: 'medium'
        }
      ],
      currentWorkarounds: [],
      urgencySignals: [],
      buyingTriggers: [],
      featureHypotheses: [
        {
          title: 'Evidence-backed insight cards may reduce synthesis time',
          summary:
            'A workflow that groups insights with short evidence snippets could help teams review discovery signal faster.',
          evidence,
          confidence: 'medium',
          evidenceStrength: 'moderate',
          directlyStated: false,
          hypothesis: 'Insight cards with evidence snippets make discovery synthesis easier to review.'
        }
      ],
      risks: [],
      openQuestions: [
        {
          title: 'Which signal should count as urgent?',
          summary:
            'The next discovery pass should clarify what makes a pain point urgent enough to influence roadmap decisions.',
          evidence,
          confidence: 'medium',
          evidenceStrength: 'weak',
          directlyStated: false,
          question: 'What threshold makes a pain point urgent enough to affect the roadmap?'
        }
      ],
      pilotSuccessCriteria: [],
      recommendedExperiments: [
        {
          title: 'Run a small synthesis review with one design partner',
          summary:
            'A practical next experiment is to review generated insight cards with a design partner and measure whether the summary matches their intent.',
          evidence,
          confidence: 'medium',
          evidenceStrength: 'moderate',
          directlyStated: false,
          experiment: 'Review generated cards with one design partner and compare against their intended meaning.'
        }
      ],
      decisionRecommendations: [
        {
          title: 'Learn more before treating this as roadmap-ready',
          summary:
            'The safest recommendation is to keep this as a learning signal until more notes confirm the same pattern.',
          evidence,
          confidence: 'medium',
          evidenceStrength: 'moderate',
          directlyStated: false,
          decision: 'learn_more'
        }
      ],
      qualityFlags: [
        {
          title: 'Mock output needs human review',
          summary:
            'The deterministic mock extractor produces useful draft structure, but a human review step is still required before trusting any recommendation.',
          severity: 'low'
        }
      ]
    };
  }

  private genericEvidence(participant: string, sourceLabel: string): ExtractionEvidence[] {
    return [
      {
        quote: `Synthetic evidence from ${participant} via ${sourceLabel}.`,
        whyItMatters:
          'This anchors the mock insight to safe source metadata without storing raw note text.'
      }
    ];
  }
}
