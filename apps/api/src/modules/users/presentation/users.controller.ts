import { Body, Controller, Get, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UsersService } from "../application/users.service";
import { CurrentUser, AuthUser } from "../../../common/decorators/current-user.decorator";

@ApiTags("users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  me(@CurrentUser() user: AuthUser) {
    return this.usersService.getById(user.id);
  }

  @Patch("me")
  updateMe(@CurrentUser() user: AuthUser, @Body() body: { name?: string }) {
    return this.usersService.updateProfile(user.id, { name: body.name });
  }
}
