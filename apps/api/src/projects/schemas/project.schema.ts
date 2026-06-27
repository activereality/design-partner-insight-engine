import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { ProjectStatus } from '../enums/project-status.enum';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 120 })
  name!: string;

  @Prop({ required: true, trim: true, maxlength: 1200 })
  description!: string;

  @Prop({ required: true, trim: true, maxlength: 240 })
  targetCustomer!: string;

  @Prop({
    enum: Object.values(ProjectStatus),
    required: true,
    type: String
  })
  status!: ProjectStatus;

  @Prop({ default: false, type: Boolean })
  isDemo!: boolean;

  @Prop({ trim: true, maxlength: 80 })
  demoKey?: string;

  createdAt!: Date;

  updatedAt!: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ demoKey: 1 });
