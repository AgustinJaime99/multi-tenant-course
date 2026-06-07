import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "@app/shared";
import { CoursesService } from "../application/courses.service";
import { CreateCourseData, CreateLessonData, CreateModuleData } from "../domain/course.repository";
import { Public } from "../../../common/decorators/public.decorator";
import { Roles } from "../../../common/decorators/roles.decorator";
import { RolesGuard } from "../../../common/guards/roles.guard";

// Static/prefixed routes MUST come before wildcard routes (:id, :courseId, etc.)
// otherwise NestJS matches the literal segment as the wildcard parameter.

@ApiTags("courses")
@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // ─── Static GET ─────────────────────────────────────────

  @Public()
  @Get()
  list() {
    return this.coursesService.listPublished();
  }

  @Public()
  @Get("slug/:slug")
  bySlug(@Param("slug") slug: string) {
    return this.coursesService.getBySlug(slug);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get("admin/all")
  listAll() {
    return this.coursesService.listAll();
  }

  // ─── Static PATCH / DELETE (modules & lessons) ──────────
  // Must come before PATCH :id / DELETE :id

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch("modules/:moduleId")
  editModule(@Param("moduleId") moduleId: string, @Body() body: Partial<CreateModuleData>) {
    return this.coursesService.editModule(moduleId, body);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete("modules/:moduleId")
  removeModule(@Param("moduleId") moduleId: string) {
    return this.coursesService.removeModule(moduleId);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch("lessons/:lessonId")
  editLesson(@Param("lessonId") lessonId: string, @Body() body: Partial<CreateLessonData>) {
    return this.coursesService.editLesson(lessonId, body);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete("lessons/:lessonId")
  removeLesson(@Param("lessonId") lessonId: string) {
    return this.coursesService.removeLesson(lessonId);
  }

  // ─── Static POST (modules & lessons) ────────────────────
  // Must come before POST :courseId/modules

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post("modules/:moduleId/lessons")
  addLesson(@Param("moduleId") moduleId: string, @Body() body: CreateLessonData) {
    return this.coursesService.addLesson(moduleId, body);
  }

  // ─── Course CRUD ─────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() body: CreateCourseData) {
    return this.coursesService.create(body);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(":id")
  update(@Param("id") id: string, @Body() body: Partial<CreateCourseData>) {
    return this.coursesService.update(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.coursesService.remove(id);
  }

  // ─── Wildcard GET / POST — must be last ──────────────────

  @Public()
  @Get(":id")
  byId(@Param("id") id: string) {
    return this.coursesService.getById(id);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post(":courseId/modules")
  addModule(@Param("courseId") courseId: string, @Body() body: CreateModuleData) {
    return this.coursesService.addModule(courseId, body);
  }
}
