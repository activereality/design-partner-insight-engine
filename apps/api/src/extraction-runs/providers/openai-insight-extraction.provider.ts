import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import {
  DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION,
  DesignPartnerExtraction,
  MOCK_EXTRACTION_PROMPT_VERSION
} from '../design-partner-extraction.contract';
import { ExtractionProvider } from '../enums/extraction-provider.enum';
import {
  ExtractInsightsInput,
  SelectedExtractionProvider
} from './insight-extraction-provider';
import { designPartnerExtractionJsonSchema } from './openai-extraction.schema';

type ResponseWithText = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

@Injectable()
export class OpenAiInsightExtractionProvider implements SelectedExtractionProvider {
  readonly provider = ExtractionProvider.OpenAi;
  readonly promptVersion = MOCK_EXTRACTION_PROMPT_VERSION;
  readonly schemaVersion = DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION;

  constructor(private readonly configService: ConfigService) {}

  get model(): string {
    return this.configService.get<string>('OPENAI_MODEL') ?? '';
  }

  async extract(input: ExtractInsightsInput): Promise<DesignPartnerExtraction> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const model = this.model;

    if (!apiKey || !model) {
      throw new ServiceUnavailableException('OpenAI provider is not configured');
    }

    const client = new OpenAI({ apiKey });
    const response = (await client.responses.create({
      model,
      input: [
        {
          role: 'system',
          content:
            'You extract startup/product discovery insights. Use only the supplied note, preserve uncertainty, prefer fewer stronger insights, cite short evidence, mark inferred items clearly, use low confidence when evidence is thin, identify missing context, avoid ungrounded recommendations, and return only valid schema-shaped JSON.'
        },
        {
          role: 'user',
          content: this.buildUserPrompt(input)
        }
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'design_partner_extraction',
          strict: true,
          schema: designPartnerExtractionJsonSchema
        }
      }
    })) as ResponseWithText;

    const outputText = this.extractOutputText(response);

    if (!outputText) {
      throw new ServiceUnavailableException('OpenAI provider returned no structured output');
    }

    return JSON.parse(outputText) as DesignPartnerExtraction;
  }

  private buildUserPrompt(input: ExtractInsightsInput): string {
    const { note } = input;

    return [
      `Schema version: ${DESIGN_PARTNER_EXTRACTION_SCHEMA_VERSION}`,
      `Note title: ${note.title}`,
      `Source type: ${note.sourceType}`,
      `Participant label: ${note.participantLabel}`,
      `Occurred at: ${note.occurredAt.toISOString()}`,
      'Raw note text follows. Treat it as sensitive and use only short evidence quotes in the output.',
      note.rawText
    ].join('\n\n');
  }

  private extractOutputText(response: ResponseWithText): string | undefined {
    if (response.output_text) {
      return response.output_text;
    }

    return response.output
      ?.flatMap((item) => item.content ?? [])
      .find((content) => content.type === 'output_text' || content.text)?.text;
  }
}
