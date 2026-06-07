import { CertificateDto } from "@app/shared";

export const CERTIFICATE_REPOSITORY = Symbol("CERTIFICATE_REPOSITORY");

export interface CertificateRecord extends CertificateDto {
  userId: string;
}

export interface CertificateRepository {
  findByUserAndCourse(userId: string, courseId: string): Promise<CertificateRecord | null>;
  findById(id: string): Promise<CertificateRecord | null>;
  create(data: {
    userId: string;
    courseId: string;
    userName: string;
    courseName: string;
  }): Promise<CertificateRecord>;
  listByUser(userId: string): Promise<CertificateDto[]>;
}
