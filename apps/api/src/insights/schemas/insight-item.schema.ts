import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

import { InsightReviewStatus } from '../enums/insight-review-status.enum';
import { InsightType } from '../enums/insight-type.enum';

export type InsightItemDocument = HydratedDocument<InsightItem>;

export interface InsightEvidence {
  noteId: string;
  snippet: string;
  source: 'mock_generic';
}

export type InsightPayload = Record<string, string | number | boolean | string[]>;

@Schema({ timestamps: true })
export class InsightItem {
  _id!: Types.ObjectId;

  @Prop({ ref: 'Project', required: true, type: Types.ObjectId })
  projectId!: Types.ObjectId;

  @Prop({ ref: 'ResearchNote', required: true, type: Types.ObjectId })
  noteId!: Types.ObjectId;

  @Prop({ ref: 'ExtractionRun', required: true, type: Types.ObjectId })
  extractionRunId!: Types.ObjectId;

  @Prop({ enum: Object.values(InsightType), required: true, type: String })
  type!: InsightType;

  @Prop({ required: true, trim: true, maxlength: 160 })
  title!: string;

  @Prop({ required: true, trim: true, maxlength: 1000 })
  summary!: string;

  @Prop({ required: true, min: 0, max: 1 })
  confidence!: number;

  @Prop({ trim: true, maxlength: 80 })
  urgency?: string;

  @Prop({ enum: Object.values(InsightReviewStatus), required: true, type: String })
  reviewStatus!: InsightReviewStatus;

  @Prop({
    default: [],
    type: [
      {
        noteId: { required: true, type: String },
        snippet: { maxlength: 180, required: true, type: String },
        source: { enum: ['mock_generic'], required: true, type: String }
      }
    ]
  })
  evidence!: InsightEvidence[];

  @Prop({ default: {}, type: MongooseSchema.Types.Mixed })
  payload!: InsightPayload;

  createdAt!: Date;

  updatedAt!: Date;
}

export const InsightItemSchema = SchemaFactory.createForClass(InsightItem);
InsightItemSchema.index({ projectId: 1, createdAt: -1 });
InsightItemSchema.index({ noteId: 1, createdAt: -1 });
