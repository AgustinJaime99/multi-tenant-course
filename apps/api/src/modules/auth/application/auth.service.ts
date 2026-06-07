import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";
import { AuthResponse, LoginInput, RegisterInput } from "@app/shared";
import { USER_REPOSITORY, UserEntity, UserRepository } from "../../users/domain/user.repository";
import { UsersService } from "../../users/application/users.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private async issueTokens(user: UserEntity) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>("jwt.accessSecret"),
      expiresIn: this.config.get<string>("jwt.accessExpires"),
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>("jwt.refreshSecret"),
      expiresIn: this.config.get<string>("jwt.refreshExpires"),
    });
    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await this.users.updateRefreshHash(user.id, refreshHash);
    return { accessToken, refreshToken };
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existing = await this.users.findByEmail(input.email);
    if (existing) throw new ConflictException("El email ya está registrado");

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.users.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });
    const tokens = await this.issueTokens(user);
    return { user: UsersService.toPublic(user), tokens };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.users.findByEmail(input.email);
    if (!user) throw new UnauthorizedException("Credenciales inválidas");
    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException("Credenciales inválidas");

    const tokens = await this.issueTokens(user);
    return { user: UsersService.toPublic(user), tokens };
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    let payload: { sub: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>("jwt.refreshSecret"),
      });
    } catch {
      throw new UnauthorizedException("Refresh token inválido");
    }

    const user = await this.users.findById(payload.sub);
    if (!user || !user.refreshHash) throw new UnauthorizedException("Sesión expirada");
    const match = await bcrypt.compare(refreshToken, user.refreshHash);
    if (!match) throw new UnauthorizedException("Refresh token inválido");

    const tokens = await this.issueTokens(user);
    return { user: UsersService.toPublic(user), tokens };
  }

  async logout(userId: string): Promise<void> {
    await this.users.updateRefreshHash(userId, null);
  }
}
