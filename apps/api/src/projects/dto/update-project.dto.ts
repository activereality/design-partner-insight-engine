import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { ProjectStatus } from '../enums/project-status.enum';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1200)
  description?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(240)
  targetCustomer?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
