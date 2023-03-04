import { Injectable } from '@nestjs/common';
import { Chapter, Course, Lecture } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/courses.dto';

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

  async updateCourseInfo(
    courseId: string,
    dto: UpdateCourseDto,
  ): Promise<Course> {
    const { tagsIds, ...dtoToSave } = dto;
    const course = await this.prisma.course.findFirst({
      where: { id: courseId },
      select: { tags: true },
    });
    const tagsExist = course.tags.map((tag) => {
      return tag.tagId;
    });
    const tagsIdsToDisconnect = tagsExist.map((tagId) => {
      if (!tagsIds.includes(tagId)) {
        return tagId;
      }
    });
    const tagsIdsToConnect = tagsExist.map((tagId) => {
      if (!tagsExist.includes(tagId)) {
        return tagId;
      }
    });
    return this.prisma.course.update({
      where: { id: courseId },
      data: {
        ...dtoToSave,
        tags: {
          disconnect: tagsIdsToDisconnect.map((tagId) => {
            return {
              courseId_tagId: {
                courseId,
                tagId,
              },
            };
          }),
          connect: tagsIdsToConnect.map((tagId) => {
            return {
              courseId_tagId: {
                courseId,
                tagId,
              },
            };
          }),
        },
      },
    });
  }
}
