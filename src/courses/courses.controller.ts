import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from 'src/decorators/user.decorator';
import { CoursesService } from './courses.service';
import { AddChapterToCourseDto, CreateCourseDto } from './dto/courses.dto';

@Controller('courses')
@ApiTags('courses')
@ApiBearerAuth()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  getMyCourses(@UserDecorator() user) {
    return this.coursesService.getMyCourses(user.id);
  }

  @Get('byAuthor/:authorId')
  getByAuthorId(@Param('authorId') authorId: string) {
    return this.coursesService.getByAuthorId(authorId);
  }

  @Get('info/:id')
  getCourseInfo(@Param('id') id: string) {
    return this.coursesService.getCourseInfo(id);
  }

  @Get(':id')
  getCourseWithContent(@Param('id') id: string) {
    return this.coursesService.getCourseContent(id);
  }

  @Post()
  createCourse(@UserDecorator() user, @Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(user.id, dto);
  }

  @Post('chapters')
  addChapter(@Body() dto: AddChapterToCourseDto) {
    return this.coursesService.addChapterToCourse(dto);
  }
}
