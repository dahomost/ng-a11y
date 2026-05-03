import { ConflictError, UnauthorizedError } from '../errors/AppError';
import type { User } from '../models';
import type { UserRepository } from '../repositories/userRepository';
import { hashPassword, verifyPassword } from '../utils/password';
import { signToken } from '../utils/jwt';

export class AuthService {
  constructor(private readonly users: UserRepository) {}

  async register(
    email: string,
    password: string,
  ): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new ConflictError('Email already registered');
    }
    const passwordHash = await hashPassword(password);
    const user = await this.users.create({
      email,
      passwordHash,
      role: 'PUBLIC',
    });
    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const { passwordHash: storedHash, ...safe } = user;
    void storedHash;
    return { user: safe, token };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedError('Invalid credentials');
    }
    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const { passwordHash, ...safe } = user;
    void passwordHash;
    return { user: safe, token };
  }
}
