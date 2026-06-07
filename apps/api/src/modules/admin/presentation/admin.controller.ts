import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "@app/shared";
import { AdminService } from "../application/admin.service";
import { UsersService } from "../../users/application/users.service";
import { PurchasesService } from "../../payments/application/purchases.service";
import { Roles } from "../../../common/decorators/roles.decorator";
import { RolesGuard } from "../../../common/guards/roles.guard";

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller("admin")
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
    private readonly purchasesService: PurchasesService,
  ) {}

  @Get("analytics")
  analytics() {
    return this.adminService.analytics();
  }

  @Get("users")
  users(@Query("page") page = "1", @Query("limit") limit = "20") {
    return this.usersService.list(parseInt(page, 10), parseInt(limit, 10));
  }

  @Get("payments")
  payments() {
    return this.adminService.listPayments();
  }

  @Get("subscriptions")
  subscriptions() {
    return this.purchasesService.listAll();
  }
}
