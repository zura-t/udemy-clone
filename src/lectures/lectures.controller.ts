import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLectureDto } from './dto/lectures.dto';
import { LecturesService } from './lectures.service';

@Controller('lectures')
@ApiTags('courses')
@ApiBearerAuth()
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @ApiOperation({ summary: 'Get lecture by id' })
  @Get(':id')
  getLecture(@Param('id') id: string) {
    return this.lecturesService.getLecture(id);
  }

  @ApiOperation({ summary: 'Create lecture' })
  @Post()
  createLecture(@Body() dto: CreateLectureDto) {
    return this.lecturesService.createLecture(dto);
  }

  @ApiOperation({ summary: 'Update lecture' })
  @Patch('id')
  updateLecture(@Param('id') id: string, @Body() dto) {
    return this.lecturesService.updateLecture(id, dto);
  }

  @ApiOperation({ summary: 'Delete lecture' })
  @Delete('id')
  deleteLecture(@Param('id') id: string) {
    return this.lecturesService.deleteLecture(id);
  }
}
