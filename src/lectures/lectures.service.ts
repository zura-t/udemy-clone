import { BadRequestException, Injectable } from '@nestjs/common';
import { Lecture } from '@prisma/client';
import { LectureErrorsCodes } from '../errors/errors-codes';
import { PrismaService } from '../prisma.service';
import { CreateLectureDto, UpdateLectureDto } from './dto/lectures.dto';

@Injectable()
export class LecturesService {
  constructor(private readonly prisma: PrismaService) {}

  getLecture(id: string): Promise<Lecture> {
    return this.prisma.lecture.findFirst({ where: { id } });
  }

  async createLecture(dto: CreateLectureDto): Promise<Lecture> {
    const { chapterId, ...dtoToSave } = dto;
    const lecturesCount = await this.prisma.lecture.count({
      where: { chapterId: dto.chapterId },
    });
    return this.prisma.lecture.create({
      data: {
        ...dtoToSave,
        index: lecturesCount + 1,
        chapter: { connect: { id: chapterId } },
      },
    });
  }

  async updateLecture(id: string, dto: UpdateLectureDto): Promise<Lecture> {
    if (dto.index) {
      await this.changeLecturesOrder(id, dto.index);
    }
    return await this.prisma.lecture.update({ where: { id }, data: { ...dto } });
  }

  async changeLecturesOrder(id: string, index: number) {
    const lecturesCount = await this.prisma.lecture.count({
      where: { chapter: { lectures: { some: { id } } } },
    });
    if (index > lecturesCount) {
      throw new BadRequestException(
        LectureErrorsCodes.INCORRECT_LECTURE_INDEX,
      );
    }
    const lecture = await this.prisma.lecture.findFirst({ where: { id } });
    if (index > lecture.index) {
      await this.prisma.lecture.updateMany({
        where: { index: { gt: lecture.index, lte: index } },
        data: { index: { decrement: 1 } },
      });
    }
    if (index < lecture.index) {
      await this.prisma.lecture.updateMany({
        where: { index: { lt: lecture.index, gte: index } },
        data: { index: { increment: 1 } },
      });
    }
  }

  deleteLecture(id: string): Promise<Lecture> {
    return this.prisma.lecture.delete({ where: { id } });
  }
}
