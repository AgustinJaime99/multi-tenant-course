import { Controller, Get, Param, Post, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { CertificatesService } from "../application/certificates.service";
import { CurrentUser, AuthUser } from "../../../common/decorators/current-user.decorator";
import { Public } from "../../../common/decorators/public.decorator";

@ApiTags("certificates")
@Controller("certificates")
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @ApiBearerAuth()
  @Get("me")
  mine(@CurrentUser() user: AuthUser) {
    return this.certificatesService.listMine(user.id);
  }

  @ApiBearerAuth()
  @Post("generate/:courseId")
  generate(@CurrentUser() user: AuthUser, @Param("courseId") courseId: string) {
    return this.certificatesService.generate(user.id, courseId);
  }

  @Public()
  @Get(":certificateId")
  get(@Param("certificateId") id: string) {
    return this.certificatesService.getPublic(id);
  }

  @Public()
  @Get(":certificateId/download")
  async download(@Param("certificateId") id: string, @Res() res: Response) {
    const pdf = await this.certificatesService.renderPdf(id);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificado-${id}.pdf"`,
      "Content-Length": pdf.length,
    });
    res.end(pdf);
  }
}
