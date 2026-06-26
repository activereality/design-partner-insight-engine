import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { MongoObjectIdPipe } from '../common/pipes/mongo-object-id.pipe';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponse } from './project.response';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(): Promise<ProjectResponse[]> {
    return this.projectsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateProjectDto): Promise<ProjectResponse> {
    return this.projectsService.create(dto);
  }

  @Get(':projectId')
  findOne(@Param('projectId', MongoObjectIdPipe) projectId: string): Promise<ProjectResponse> {
    return this.projectsService.findOne(projectId);
  }

  @Patch(':projectId')
  update(
    @Param('projectId', MongoObjectIdPipe) projectId: string,
    @Body() dto: UpdateProjectDto
  ): Promise<ProjectResponse> {
    return this.projectsService.update(projectId, dto);
  }
}
