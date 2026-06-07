import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PublicUser } from "@app/shared";
import { USER_REPOSITORY, UserEntity, UserRepository } from "../domain/user.repository";

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  static toPublic(u: UserEntity): PublicUser {
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
    };
  }

  async getById(id: string): Promise<PublicUser> {
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundException("Usuario no encontrado");
    return UsersService.toPublic(user);
  }

  async updateProfile(id: string, data: { name?: string }): Promise<PublicUser> {
    const user = await this.users.updateProfile(id, data);
    return UsersService.toPublic(user);
  }

  async list(page = 1, limit = 20): Promise<{ items: PublicUser[]; total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.users.findAll(skip, limit),
      this.users.count(),
    ]);
    return { items: items.map(UsersService.toPublic), total };
  }
}
