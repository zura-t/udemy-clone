import { Injectable } from '@nestjs/common';
import { Course } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateCourseDto } from './dto/courses.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyCourses(id: string): Promise<Course[]> {
    return this.prisma.course.findMany({ where: { authorId: id } });
  }

  async getByAuthorId(id: string): Promise<Course[]> {
    return this.prisma.course.findMany({ where: { authorId: id } });
  }

  async getById(id: string): Promise<Course> {
    return this.prisma.course.findFirst({ where: { id } });
  }

  async createCourse(dto: CreateCourseDto): Promise<Course> {
    const { authorId, tags, ...dtoToSave } = dto;
    return this.prisma.course.create({
      data: { ...dtoToSave, author: { connect: { id: authorId } } },
    });
  }
}
