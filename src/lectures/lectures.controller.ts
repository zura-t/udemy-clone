import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from '../decorators/user.decorator';
import { CreateLectureDto } from './dto/lectures.dto';
import { LecturesService } from './lectures.service';

@Controller('lectures')
@ApiTags('courses')
@ApiBearerAuth()
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @Get(':id')
  getLecture(@Param('id') id: string) {
    return this.lecturesService.getLecture(id);
  }

  @Post()
  createLecture(@Body() dto: CreateLectureDto) {
    return this.lecturesService.createLecture(dto);
  }

  @Post('upload')
  uploadFile() {}

  @Patch('id')
  updateLecture(@Param('id') id: string, @Body() dto) {
    return this.lecturesService.updateLecture(id, dto);
  }

  @Delete('id')
  deleteLecture(@Param('id') id: string) {
    return this.lecturesService.deleteLecture(id);
  }
}
