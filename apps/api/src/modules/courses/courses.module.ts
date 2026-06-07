import { Module } from "@nestjs/common";
import { CoursesService } from "./application/courses.service";
import { CoursesController } from "./presentation/courses.controller";
import { COURSE_REPOSITORY } from "./domain/course.repository";
import { PrismaCourseRepository } from "./infrastructure/prisma-course.repository";

@Module({
  controllers: [CoursesController],
  providers: [
    CoursesService,
    { provide: COURSE_REPOSITORY, useClass: PrismaCourseRepository },
  ],
  exports: [CoursesService, COURSE_REPOSITORY],
})
export class CoursesModule {}
