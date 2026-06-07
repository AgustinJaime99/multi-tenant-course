import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "@app/shared";
import { PurchasesService } from "../application/purchases.service";
import { CurrentUser, AuthUser } from "../../../common/decorators/current-user.decorator";
import { Roles } from "../../../common/decorators/roles.decorator";
import { RolesGuard } from "../../../common/guards/roles.guard";

@ApiTags("purchases")
@ApiBearerAuth()
@Controller("purchases")
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get("me")
  mine(@CurrentUser() user: AuthUser) {
    return this.purchasesService.listMine(user.id);
  }

  @Get("me/payments")
  myPayments(@CurrentUser() user: AuthUser) {
    return this.purchasesService.listMyPayments(user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get("admin")
  all() {
    return this.purchasesService.listAll();
  }
}
