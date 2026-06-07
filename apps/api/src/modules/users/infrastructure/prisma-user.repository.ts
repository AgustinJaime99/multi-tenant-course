import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { CreateUserData, UserEntity, UserRepository } from "../domain/user.repository";
import { Role } from "@app/shared";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private map(u: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    refreshHash: string | null;
    createdAt: Date;
  }): UserEntity {
    return { ...u, role: u.role as Role };
  }

  async findById(id: string): Promise<UserEntity | null> {
    const u = await this.prisma.user.findUnique({ where: { id } });
    return u ? this.map(u) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const u = await this.prisma.user.findUnique({ where: { email } });
    return u ? this.map(u) : null;
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const u = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role ?? Role.USER,
      },
    });
    return this.map(u);
  }

  async updateRefreshHash(id: string, refreshHash: string | null): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { refreshHash } });
  }

  async updateProfile(id: string, data: { name?: string }): Promise<UserEntity> {
    const u = await this.prisma.user.update({ where: { id }, data });
    return this.map(u);
  }

  count(): Promise<number> {
    return this.prisma.user.count();
  }

  async findAll(skip: number, take: number): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    return users.map((u) => this.map(u));
  }
}
