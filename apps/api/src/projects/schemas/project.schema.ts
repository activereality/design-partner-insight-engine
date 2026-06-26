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

  createdAt!: Date;

  updatedAt!: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
