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
import { CreateCourseData } from "../domain/course.repository";
import { Public } from "../../../common/decorators/public.decorator";
import { Roles } from "../../../common/decorators/roles.decorator";
import { RolesGuard } from "../../../common/guards/roles.guard";

@ApiTags("courses")
@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

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

  @Public()
  @Get(":id")
  byId(@Param("id") id: string) {
    return this.coursesService.getById(id);
  }

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
}
