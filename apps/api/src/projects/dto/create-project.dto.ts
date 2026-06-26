import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

import { ProjectStatus } from '../enums/project-status.enum';

export class CreateProjectDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1200)
  description!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(240)
  targetCustomer!: string;

  @IsEnum(ProjectStatus)
  status!: ProjectStatus;
}
