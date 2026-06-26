import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponse, toProjectResponse } from './project.response';
import { Project, ProjectDocument } from './schemas/project.schema';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private readonly projectModel: Model<Project>) {}

  async create(dto: CreateProjectDto): Promise<ProjectResponse> {
    const project = await this.projectModel.create(dto);
    return toProjectResponse(project);
  }

  async findAll(): Promise<ProjectResponse[]> {
    const projects = await this.projectModel.find().sort({ updatedAt: -1 }).exec();
    return projects.map(toProjectResponse);
  }

  async findOne(projectId: string): Promise<ProjectResponse> {
    const project = await this.findProjectDocument(projectId);
    return toProjectResponse(project);
  }

  async update(projectId: string, dto: UpdateProjectDto): Promise<ProjectResponse> {
    const project = await this.projectModel
      .findByIdAndUpdate(projectId, dto, { new: true, runValidators: true })
      .exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return toProjectResponse(project);
  }

  async ensureExists(projectId: string): Promise<void> {
    await this.findProjectDocument(projectId);
  }

  private async findProjectDocument(projectId: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findById(projectId).exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }
}
