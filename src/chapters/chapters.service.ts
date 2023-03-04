import { Injectable } from '@nestjs/common';
import { Chapter } from '@prisma/client';
import { AddChapterToCourseDto, UpdateChapterDto } from './dto/chapters.dto';
import { PrismaService } from '../prisma.service';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class ChaptersService {
  constructor(private readonly prisma: PrismaService) {}

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

  async updateChapter(id: string, dto: UpdateChapterDto): Promise<Chapter> {
    if (dto.index) {
      await this.changeChaptersOrder(id, dto.index);
    }
    return this.prisma.chapter.update({ where: { id }, data: { ...dto } });
  }

  async changeChaptersOrder(id: string, index: number) {
    const chaptersCount = await this.prisma.chapter.count({
      where: { course: { chapters: { some: { id } } } },
    });
    if (index > chaptersCount) {
      throw new BadRequestException('Incorrect index of chapter');
    }
    const chapter = await this.prisma.chapter.findFirst({ where: { id } });
    if (index > chapter.index) {
      await this.prisma.chapter.updateMany({
        where: { index: { gt: chapter.index, lte: index } },
        data: { index: { decrement: 1 } },
      });
    }
    if (index < chapter.index) {
      await this.prisma.chapter.updateMany({
        where: { index: { lt: chapter.index, gte: index } },
        data: { index: { increment: 1 } },
      });
    }
  }

  deleteChapter(id: string): Promise<Chapter> {
    return this.prisma.chapter.delete({ where: { id } });
  }
}
