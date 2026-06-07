import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  createTicketSchema,
  CreateTicketInput,
  ticketMessageSchema,
  TicketMessageInput,
  updateTicketStatusSchema,
  UpdateTicketStatusInput,
  Role,
} from "@app/shared";
import { SupportService } from "../application/support.service";
import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe";
import { CurrentUser, AuthUser } from "../../../common/decorators/current-user.decorator";
import { Roles } from "../../../common/decorators/roles.decorator";
import { RolesGuard } from "../../../common/guards/roles.guard";

@ApiTags("support")
@ApiBearerAuth()
@Controller("support/tickets")
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createTicketSchema))
  create(@CurrentUser() user: AuthUser, @Body() body: CreateTicketInput) {
    return this.supportService.createTicket(user.id, body.subject, body.message);
  }

  @Get("me")
  mine(@CurrentUser() user: AuthUser) {
    return this.supportService.listMine(user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get("admin")
  all() {
    return this.supportService.listAll();
  }

  @Post(":id/messages")
  reply(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(ticketMessageSchema)) body: TicketMessageInput,
  ) {
    if (user.role === Role.ADMIN) {
      return this.supportService.addAdminMessage(id, user.id, body.message);
    }
    return this.supportService.addUserMessage(id, user.id, body.message);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateTicketStatusSchema)) body: UpdateTicketStatusInput,
  ) {
    return this.supportService.updateStatus(id, body.status);
  }
}
