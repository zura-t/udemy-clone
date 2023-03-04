import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateLectureDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsUUID('4', { each: true })
  chapterId: string;
}

export class UpdateLectureDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  index: number;
}
