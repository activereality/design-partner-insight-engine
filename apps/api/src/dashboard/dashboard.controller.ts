import { Controller, Get, Param } from '@nestjs/common';

import { ProjectDashboardResponse } from './dashboard.response';
import { DashboardService } from './dashboard.service';
import { MongoObjectIdPipe } from '../common/pipes/mongo-object-id.pipe';

@Controller('projects/:projectId/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getProjectDashboard(
    @Param('projectId', MongoObjectIdPipe) projectId: string
  ): Promise<ProjectDashboardResponse> {
    return this.dashboardService.getProjectDashboard(projectId);
  }
}
