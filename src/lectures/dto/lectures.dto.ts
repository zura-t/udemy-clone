import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateLectureDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  index: number;

  @ApiProperty()
  @IsUUID('4', { each: true })
  chapterId: string;
}
