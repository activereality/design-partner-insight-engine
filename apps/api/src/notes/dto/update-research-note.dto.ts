import { IsEnum, IsISO8601, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { ResearchNoteSourceType } from '../enums/research-note-source-type.enum';

export class UpdateResearchNoteDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  title?: string;

  @IsOptional()
  @IsEnum(ResearchNoteSourceType)
  sourceType?: ResearchNoteSourceType;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  participantLabel?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  rawText?: string;

  @IsOptional()
  @IsISO8601()
  occurredAt?: string;
}
