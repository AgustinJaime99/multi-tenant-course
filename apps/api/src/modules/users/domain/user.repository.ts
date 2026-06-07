import { Role } from "@app/shared";

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  refreshHash: string | null;
  createdAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  role?: Role;
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(data: CreateUserData): Promise<UserEntity>;
  updateRefreshHash(id: string, refreshHash: string | null): Promise<void>;
  updateProfile(id: string, data: { name?: string }): Promise<UserEntity>;
  count(): Promise<number>;
  findAll(skip: number, take: number): Promise<UserEntity[]>;
}
