import { ApiProperty } from '@nestjs/swagger';
import { Category, CourseTag } from '@prisma/client';
import { IsEnum, IsNumber, IsNumberString, IsString, IsUUID } from 'class-validator';

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

  @ApiProperty({isArray: true})
  @IsUUID('4', {each: true})
  tagsIds: string[];

  @ApiProperty({ enum: Category })
  @IsEnum(Category)
  category: Category;
}

export class AddChapterToCourseDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  index: number;

  @ApiProperty()
  @IsString()
  courseId: string;
}
