import { Injectable } from '@nestjs/common';
import { Chapter, Course, Lecture } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AddChapterToCourseDto, CreateCourseDto } from './dto/courses.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyCourses(id: string): Promise<Course[]> {
    return this.prisma.course.findMany({ where: { authorId: id } });
  }

  async getByAuthorId(id: string): Promise<Course[]> {
    return this.prisma.course.findMany({ where: { authorId: id } });
  }

  async getCourseInfo(id: string): Promise<Course> {
    return this.prisma.course.findFirst({ where: { id } });
  }

  async getCourseContent(id: string): Promise<
    (Chapter & {
      lectures: Lecture[];
    })[]
  > {
    const course = await this.prisma.course.findFirst({
      where: { id },
      select: { chapters: { include: { lectures: true } } },
    });
    return course.chapters;
  }

  async createCourse(authorId: string, dto: CreateCourseDto): Promise<Course> {
    const { tagsIds, ...dtoToSave } = dto;
    return this.prisma.course.create({
      data: {
        ...dtoToSave,
        author: { connect: { id: authorId } },
        tags: {
          create: tagsIds
            ? tagsIds.map((tagId) => {
                return { tag: { connect: { id: tagId } } };
              })
            : [],
        },
      },
    });
  }

  async addChapterToCourse(dto: AddChapterToCourseDto): Promise<Chapter> {
    const { courseId, ...dtoToSave } = dto;
    const chaptersCount = await this.prisma.chapter.count({
      where: { courseId: dto.courseId },
    });
    return this.prisma.chapter.create({
      data: {
        ...dtoToSave,
        index: chaptersCount + 1,
        course: { connect: { id: courseId } },
      },
    });
  }
}
