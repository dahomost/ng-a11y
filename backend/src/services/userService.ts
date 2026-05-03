import { ConflictError, NotFoundError } from '../errors/AppError';
import type { User, UserRole } from '../models';
import type { UserRepository } from '../repositories/userRepository';
import { hashPassword } from '../utils/password';
import type { AuditService } from './auditService';

export class UserService {
  constructor(
    private readonly users: UserRepository,
    private readonly audit: AuditService,
  ) {}

  async create(
    actorId: string,
    input: { email: string; password: string; role: UserRole },
  ): Promise<Omit<User, 'passwordHash'>> {
    const existing = await this.users.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('Email already in use');
    }
    const passwordHash = await hashPassword(input.password);
    const user = await this.users.create({
      email: input.email,
      passwordHash,
      role: input.role,
    });
    await this.audit.record({
      action: 'CREATE',
      entityType: 'user',
      entityId: user.id,
      userId: actorId,
      metadata: { email: user.email, role: user.role },
    });
    const { passwordHash: hashFromDb, ...safe } = user;
    void hashFromDb;
    return safe;
  }

  async list(): Promise<Omit<User, 'passwordHash'>[]> {
    return this.users.list();
  }

  async getById(id: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.users.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const { passwordHash, ...safe } = user;
    void passwordHash;
    return safe;
  }

  async update(
    actorId: string,
    id: string,
    patch: Partial<{ email: string; password: string; role: UserRole }>,
  ): Promise<Omit<User, 'passwordHash'>> {
    const existing = await this.users.findById(id);
    if (!existing) {
      throw new NotFoundError('User not found');
    }
    if (patch.email && patch.email.toLowerCase() !== existing.email) {
      const dup = await this.users.findByEmail(patch.email);
      if (dup) {
        throw new ConflictError('Email already in use');
      }
    }
    const passwordHash = patch.password
      ? await hashPassword(patch.password)
      : undefined;
    const updated = await this.users.update(id, {
      email: patch.email,
      passwordHash,
      role: patch.role,
    });
    if (!updated) {
      throw new NotFoundError('User not found');
    }
    await this.audit.record({
      action: 'UPDATE',
      entityType: 'user',
      entityId: id,
      userId: actorId,
      metadata: {
        patch: {
          ...patch,
          password: patch.password ? '[redacted]' : undefined,
        },
      },
    });
    const { passwordHash: hashFromDb, ...safe } = updated;
    void hashFromDb;
    return safe;
  }

  async remove(actorId: string, id: string): Promise<void> {
    const ok = await this.users.delete(id);
    if (!ok) {
      throw new NotFoundError('User not found');
    }
    await this.audit.record({
      action: 'DELETE',
      entityType: 'user',
      entityId: id,
      userId: actorId,
    });
  }
}
