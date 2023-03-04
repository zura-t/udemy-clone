import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from 'src/decorators/user.decorator';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/courses.dto';

@Controller('courses')
@ApiTags('courses')
@ApiBearerAuth()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({ summary: 'Add new role' })
  @Get()
  getMyCourses(@UserDecorator() user) {
    return this.coursesService.getMyCourses(user.id);
  }

  @ApiOperation({ summary: 'Get course by author id' })
  @Get('byAuthor/:authorId')
  getByAuthorId(@Param('authorId') authorId: string) {
    return this.coursesService.getByAuthorId(authorId);
  }

  @ApiOperation({ summary: 'Get course info' })
  @Get('info/:id')
  getCourseInfo(@Param('id') id: string) {
    return this.coursesService.getCourseInfo(id);
  }

  @ApiOperation({ summary: 'Get course content' })
  @Get(':id')
  getCourseWithContent(@Param('id') id: string) {
    return this.coursesService.getCourseContent(id);
  }

  @ApiOperation({ summary: 'Create course' })
  @Post()
  createCourse(@UserDecorator() user, @Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(user.id, dto);
  }
}
