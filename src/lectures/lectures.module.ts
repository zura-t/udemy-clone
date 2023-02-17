import { Module } from '@nestjs/common';
import { FilesModule } from '../files/files.module';
import { PrismaService } from '../prisma.service';
import { LecturesController } from './lectures.controller';
import { LecturesService } from './lectures.service';

@Module({
  imports: [FilesModule],
  controllers: [LecturesController],
  providers: [LecturesService, PrismaService],
})
export class LecturesModule {}
