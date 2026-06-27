import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

function trimString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class UpdateInsightDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  @Transform(({ value }) => trimString(value))
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  @Transform(({ value }) => trimString(value))
  summary?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }) => trimString(value))
  reviewNotes?: string;
}
