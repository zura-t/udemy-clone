import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddChapterToCourseDto, UpdateChapterDto } from './dto/chapters.dto';
import { ChaptersService } from './chapters.service';
import { Chapter } from '@prisma/client';

@Controller('chapters')
@ApiTags('chapters')
@ApiBearerAuth()
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @ApiOperation({ summary: 'Add chapter to course' })
  @Post()
  addChapter(@Body() dto: AddChapterToCourseDto): Promise<Chapter> {
    return this.chaptersService.addChapterToCourse(dto);
  }

  @ApiOperation({ summary: 'Update chapter' })
  @Patch(':id')
  updateChapter(
    @Param('id') id: string,
    @Body() dto: UpdateChapterDto,
  ): Promise<Chapter> {
    return this.chaptersService.updateChapter(id, dto);
  }

  @ApiOperation({ summary: 'Delete chapter' })
  @Delete(':id')
  deleteChapter(@Param('id') id: string): Promise<Chapter> {
    return this.chaptersService.deleteChapter(id);
  }
}
