import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { ResearchNoteSourceType } from '../enums/research-note-source-type.enum';

export type ResearchNoteDocument = HydratedDocument<ResearchNote>;

@Schema({ timestamps: true })
export class ResearchNote {
  _id!: Types.ObjectId;

  @Prop({ ref: 'Project', required: true, type: Types.ObjectId })
  projectId!: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 160 })
  title!: string;

  @Prop({
    enum: Object.values(ResearchNoteSourceType),
    required: true,
    type: String
  })
  sourceType!: ResearchNoteSourceType;

  @Prop({ required: true, trim: true, maxlength: 160 })
  participantLabel!: string;

  @Prop({ required: true, maxlength: 10000 })
  rawText!: string;

  @Prop({ required: true, type: Date })
  occurredAt!: Date;

  createdAt!: Date;

  updatedAt!: Date;
}

export const ResearchNoteSchema = SchemaFactory.createForClass(ResearchNote);
ResearchNoteSchema.index({ projectId: 1, updatedAt: -1 });
