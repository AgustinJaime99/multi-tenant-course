import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ProgressService } from "../application/progress.service";
import { CurrentUser, AuthUser } from "../../../common/decorators/current-user.decorator";

@ApiTags("progress")
@ApiBearerAuth()
@Controller("progress")
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get(":courseId")
  get(@CurrentUser() user: AuthUser, @Param("courseId") courseId: string) {
    return this.progressService.getCourseProgress(user.id, courseId);
  }

  @Post(":courseId/lessons/:lessonId/complete")
  complete(
    @CurrentUser() user: AuthUser,
    @Param("courseId") courseId: string,
    @Param("lessonId") lessonId: string,
  ) {
    return this.progressService.completeLesson(user.id, courseId, lessonId);
  }

  @Delete(":courseId/lessons/:lessonId/complete")
  uncomplete(
    @CurrentUser() user: AuthUser,
    @Param("courseId") courseId: string,
    @Param("lessonId") lessonId: string,
  ) {
    return this.progressService.uncompleteLesson(user.id, courseId, lessonId);
  }
}
