import { ProjectDocument } from './schemas/project.schema';

export interface ProjectResponse {
  id: string;
  name: string;
  description: string;
  targetCustomer: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function toProjectResponse(project: ProjectDocument): ProjectResponse {
  return {
    id: project._id.toString(),
    name: project.name,
    description: project.description,
    targetCustomer: project.targetCustomer,
    status: project.status,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString()
  };
}
