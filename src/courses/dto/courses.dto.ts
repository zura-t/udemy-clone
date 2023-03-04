import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category, CourseTag } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ isArray: true })
  @IsUUID('4', { each: true })
  @IsOptional()
  tagsIds: string[];

  @ApiProperty({ enum: Category })
  @IsEnum(Category)
  category: Category;
}

export class UpdateCourseDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiPropertyOptional({ isArray: true })
  @IsUUID('4', { each: true })
  @IsOptional()
  tagsIds: string[];

  @ApiPropertyOptional({ enum: Category })
  @IsEnum(Category)
  @IsOptional()
  category: Category;
}
