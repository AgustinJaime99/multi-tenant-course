import { Module } from "@nestjs/common";
import { SupportService } from "./application/support.service";
import { SupportController } from "./presentation/support.controller";
import { SUPPORT_REPOSITORY } from "./domain/support.repository";
import { PrismaSupportRepository } from "./infrastructure/prisma-support.repository";

@Module({
  controllers: [SupportController],
  providers: [
    SupportService,
    { provide: SUPPORT_REPOSITORY, useClass: PrismaSupportRepository },
  ],
  exports: [SupportService],
})
export class SupportModule {}
