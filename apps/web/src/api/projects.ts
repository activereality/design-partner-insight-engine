import { requestJson } from './client';

export const projectStatuses = ['exploring', 'validating', 'pilot_planning', 'paused', 'archived'] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export interface Project {
  id: string;
  name: string;
  description: string;
  targetCustomer: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description: string;
  targetCustomer: string;
  status: ProjectStatus;
}

export type UpdateProjectInput = Partial<CreateProjectInput>;

export function listProjects(): Promise<Project[]> {
  return requestJson<Project[]>('/api/projects');
}

export function createProject(input: CreateProjectInput): Promise<Project> {
  return requestJson<Project>('/api/projects', {
    body: JSON.stringify(input),
    method: 'POST'
  });
}

export function getProject(projectId: string): Promise<Project> {
  return requestJson<Project>(`/api/projects/${projectId}`);
}

export function updateProject(projectId: string, input: UpdateProjectInput): Promise<Project> {
  return requestJson<Project>(`/api/projects/${projectId}`, {
    body: JSON.stringify(input),
    method: 'PATCH'
  });
}
