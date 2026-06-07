import { Body, Controller, Get, HttpCode, Post, UsePipes } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  loginSchema,
  registerSchema,
  refreshSchema,
  LoginInput,
  RegisterInput,
  RefreshInput,
} from "@app/shared";
import { AuthService } from "../application/auth.service";
import { UsersService } from "../../users/application/users.service";
import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe";
import { Public } from "../../../common/decorators/public.decorator";
import { CurrentUser, AuthUser } from "../../../common/decorators/current-user.decorator";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post("register")
  @UsePipes(new ZodValidationPipe(registerSchema))
  register(@Body() body: RegisterInput) {
    return this.authService.register(body);
  }

  @Public()
  @Post("login")
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(loginSchema))
  login(@Body() body: LoginInput) {
    return this.authService.login(body);
  }

  @Public()
  @Post("refresh")
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(refreshSchema))
  refresh(@Body() body: RefreshInput) {
    return this.authService.refresh(body.refreshToken);
  }

  @ApiBearerAuth()
  @Post("logout")
  @HttpCode(204)
  async logout(@CurrentUser() user: AuthUser) {
    await this.authService.logout(user.id);
  }

  @ApiBearerAuth()
  @Get("me")
  me(@CurrentUser() user: AuthUser) {
    return this.usersService.getById(user.id);
  }
}
