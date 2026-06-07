import { Injectable } from "@nestjs/common";
import { CertificateDto } from "@app/shared";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import {
  CertificateRecord,
  CertificateRepository,
} from "../domain/certificate.repository";

@Injectable()
export class PrismaCertificateRepository implements CertificateRepository {
  constructor(private readonly prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map(c: any): CertificateRecord {
    return {
      id: c.id,
      userId: c.userId,
      courseId: c.courseId,
      courseTitle: c.courseName,
      userName: c.userName,
      issuedAt: c.issuedAt.toISOString(),
    };
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<CertificateRecord | null> {
    const c = await this.prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    return c ? this.map(c) : null;
  }

  async findById(id: string): Promise<CertificateRecord | null> {
    const c = await this.prisma.certificate.findUnique({ where: { id } });
    return c ? this.map(c) : null;
  }

  async create(data: {
    userId: string;
    courseId: string;
    userName: string;
    courseName: string;
  }): Promise<CertificateRecord> {
    const c = await this.prisma.certificate.create({ data });
    return this.map(c);
  }

  async listByUser(userId: string): Promise<CertificateDto[]> {
    const list = await this.prisma.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: "desc" },
    });
    return list.map((c) => {
      const m = this.map(c);
      return {
        id: m.id,
        courseId: m.courseId,
        courseTitle: m.courseTitle,
        userName: m.userName,
        issuedAt: m.issuedAt,
      };
    });
  }
}
