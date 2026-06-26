import { IsEnum, IsISO8601, IsString, MaxLength, MinLength } from 'class-validator';

import { ResearchNoteSourceType } from '../enums/research-note-source-type.enum';

export class CreateResearchNoteDto {
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  title!: string;

  @IsEnum(ResearchNoteSourceType)
  sourceType!: ResearchNoteSourceType;

  @IsString()
  @MinLength(1)
  @MaxLength(160)
  participantLabel!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  rawText!: string;

  @IsISO8601()
  occurredAt!: string;
}
