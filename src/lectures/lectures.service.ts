import { Injectable } from '@nestjs/common';
import { Lecture } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateLectureDto } from './dto/lectures.dto';

@Injectable()
export class LecturesService {
  constructor(private readonly prisma: PrismaService) {}

  getLecture(id: string) {
    return this.prisma.lecture.findFirst({ where: { id } });
  }

  createLecture(dto: CreateLectureDto): Promise<Lecture> {
    const { chapterId, ...dtoToSave } = dto;
    return this.prisma.lecture.create({
      data: { ...dtoToSave, chapter: { connect: { id: chapterId } } },
    });
  }

  updateLecture(id: string, dto) {
    return this.prisma.lecture.update({ where: { id }, data: { ...dto } });
  }

  deleteLecture(id: string): Promise<Lecture> {
    return this.prisma.lecture.delete({ where: { id } });
  }
}
