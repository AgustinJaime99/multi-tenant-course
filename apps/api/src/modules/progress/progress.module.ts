import { Module } from "@nestjs/common";
import { ProgressService } from "./application/progress.service";
import { ProgressController } from "./presentation/progress.controller";
import { PROGRESS_REPOSITORY } from "./domain/progress.repository";
import { PrismaProgressRepository } from "./infrastructure/prisma-progress.repository";
import { CoursesModule } from "../courses/courses.module";

@Module({
  imports: [CoursesModule],
  controllers: [ProgressController],
  providers: [
    ProgressService,
    { provide: PROGRESS_REPOSITORY, useClass: PrismaProgressRepository },
  ],
  exports: [ProgressService, PROGRESS_REPOSITORY],
})
export class ProgressModule {}
