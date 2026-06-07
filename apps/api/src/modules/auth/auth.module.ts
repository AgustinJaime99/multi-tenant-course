import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./application/auth.service";
import { AuthController } from "./presentation/auth.controller";
import { JwtStrategy } from "./infrastructure/jwt.strategy";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
