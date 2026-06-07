import { Module } from "@nestjs/common";
import { AdminService } from "./application/admin.service";
import { AdminController } from "./presentation/admin.controller";
import { UsersModule } from "../users/users.module";
import { CoursesModule } from "../courses/courses.module";
import { PaymentsModule } from "../payments/payments.module";

@Module({
  imports: [UsersModule, CoursesModule, PaymentsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
