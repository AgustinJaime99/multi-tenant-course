import { Module } from "@nestjs/common";
import { CertificatesService } from "./application/certificates.service";
import { CertificatesController } from "./presentation/certificates.controller";
import { CERTIFICATE_REPOSITORY } from "./domain/certificate.repository";
import { PrismaCertificateRepository } from "./infrastructure/prisma-certificate.repository";
import { ProgressModule } from "../progress/progress.module";
import { CoursesModule } from "../courses/courses.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [ProgressModule, CoursesModule, UsersModule],
  controllers: [CertificatesController],
  providers: [
    CertificatesService,
    { provide: CERTIFICATE_REPOSITORY, useClass: PrismaCertificateRepository },
  ],
  exports: [CertificatesService],
})
export class CertificatesModule {}
