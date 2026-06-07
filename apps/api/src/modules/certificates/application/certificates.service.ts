import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import PDFDocument from "pdfkit";
import { CertificateDto } from "@app/shared";
import {
  CERTIFICATE_REPOSITORY,
  CertificateRecord,
  CertificateRepository,
} from "../domain/certificate.repository";
import { ProgressService } from "../../progress/application/progress.service";
import { CoursesService } from "../../courses/application/courses.service";
import { UsersService } from "../../users/application/users.service";

@Injectable()
export class CertificatesService {
  constructor(
    @Inject(CERTIFICATE_REPOSITORY) private readonly certificates: CertificateRepository,
    private readonly progress: ProgressService,
    private readonly courses: CoursesService,
    private readonly users: UsersService,
  ) {}

  listMine(userId: string): Promise<CertificateDto[]> {
    return this.certificates.listByUser(userId);
  }

  async getPublic(id: string): Promise<CertificateDto> {
    const c = await this.certificates.findById(id);
    if (!c) throw new NotFoundException("Certificado no encontrado");
    return {
      id: c.id,
      courseId: c.courseId,
      courseTitle: c.courseTitle,
      userName: c.userName,
      issuedAt: c.issuedAt,
    };
  }

  async generate(userId: string, courseId: string): Promise<CertificateDto> {
    const existing = await this.certificates.findByUserAndCourse(userId, courseId);
    if (existing) return this.getPublic(existing.id);

    const progress = await this.progress.getCourseProgress(userId, courseId);
    if (!progress.isCompleted) {
      throw new BadRequestException("Debes completar el curso para obtener el certificado");
    }

    const [course, user] = await Promise.all([
      this.courses.getById(courseId),
      this.users.getById(userId),
    ]);

    const cert = await this.certificates.create({
      userId,
      courseId,
      userName: user.name,
      courseName: course.title,
    });
    return this.getPublic(cert.id);
  }

  async renderPdf(id: string): Promise<Buffer> {
    const cert = await this.certificates.findById(id);
    if (!cert) throw new NotFoundException("Certificado no encontrado");
    return this.buildPdf(cert);
  }

  private buildPdf(cert: CertificateRecord): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 50 });
      const chunks: Buffer[] = [];
      doc.on("data", (c: Buffer) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const W = doc.page.width;
      doc.rect(20, 20, W - 40, doc.page.height - 40).lineWidth(3).stroke("#0f172a");
      doc.moveDown(2);
      doc.fontSize(34).fillColor("#0f172a").text("CERTIFICADO DE FINALIZACIÓN", { align: "center" });
      doc.moveDown(1);
      doc.fontSize(16).fillColor("#475569").text("Se otorga el presente certificado a", { align: "center" });
      doc.moveDown(0.5);
      doc.fontSize(30).fillColor("#b45309").text(cert.userName, { align: "center" });
      doc.moveDown(0.8);
      doc.fontSize(16).fillColor("#475569").text("por haber completado satisfactoriamente el curso", { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(22).fillColor("#0f172a").text(cert.courseTitle, { align: "center" });
      doc.moveDown(2);
      const issued = new Date(cert.issuedAt).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.fontSize(12).fillColor("#64748b").text(`Fecha de emisión: ${issued}`, { align: "center" });
      doc.fontSize(10).fillColor("#94a3b8").text(`ID de certificado: ${cert.id}`, { align: "center" });

      doc.end();
    });
  }
}
