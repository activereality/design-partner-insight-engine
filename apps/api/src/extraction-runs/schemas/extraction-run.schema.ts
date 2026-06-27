import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

import { ExtractionProvider } from '../enums/extraction-provider.enum';
import { ExtractionRunStatus } from '../enums/extraction-run-status.enum';

export type ExtractionRunDocument = HydratedDocument<ExtractionRun>;

export interface ExtractionRunRawResponse {
  kind: 'mock_metadata';
  insightCount: number;
  schemaVersion: string;
}

@Schema({ timestamps: true })
export class ExtractionRun {
  _id!: Types.ObjectId;

  @Prop({ ref: 'Project', required: true, type: Types.ObjectId })
  projectId!: Types.ObjectId;

  @Prop({ ref: 'ResearchNote', required: true, type: Types.ObjectId })
  noteId!: Types.ObjectId;

  @Prop({ enum: Object.values(ExtractionRunStatus), required: true, type: String })
  status!: ExtractionRunStatus;

  @Prop({ enum: Object.values(ExtractionProvider), required: true, type: String })
  provider!: ExtractionProvider;

  @Prop({ required: true, trim: true, maxlength: 120 })
  model!: string;

  @Prop({ required: true, trim: true, maxlength: 80 })
  promptVersion!: string;

  @Prop({ required: true, trim: true, maxlength: 80 })
  schemaVersion!: string;

  @Prop({ required: true, type: Date })
  startedAt!: Date;

  @Prop({ type: Date })
  completedAt?: Date;

  @Prop({ trim: true, maxlength: 500 })
  errorMessage?: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  rawResponse?: ExtractionRunRawResponse;

  createdAt!: Date;

  updatedAt!: Date;
}

export const ExtractionRunSchema = SchemaFactory.createForClass(ExtractionRun);
ExtractionRunSchema.index({ projectId: 1, createdAt: -1 });
ExtractionRunSchema.index({ noteId: 1, createdAt: -1 });
