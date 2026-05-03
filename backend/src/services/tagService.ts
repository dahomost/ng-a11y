import { ConflictError, NotFoundError } from '../errors/AppError';
import type { Tag } from '../models';
import type { TagRepository } from '../repositories/tagRepository';
import type { AuditService } from './auditService';

export class TagService {
  constructor(
    private readonly tags: TagRepository,
    private readonly audit: AuditService,
  ) {}

  async create(actorId: string, name: string): Promise<Tag> {
    try {
      const tag = await this.tags.create(name);
      await this.audit.record({
        action: 'CREATE',
        entityType: 'tag',
        entityId: tag.id,
        userId: actorId,
        metadata: { name: tag.name },
      });
      return tag;
    } catch (e: unknown) {
      if (this.isUniqueViolation(e)) {
        throw new ConflictError('Tag name already exists');
      }
      throw e;
    }
  }

  async list(): Promise<Tag[]> {
    return this.tags.list();
  }

  async remove(actorId: string, id: string): Promise<void> {
    const ok = await this.tags.delete(id);
    if (!ok) {
      throw new NotFoundError('Tag not found');
    }
    await this.audit.record({
      action: 'DELETE',
      entityType: 'tag',
      entityId: id,
      userId: actorId,
    });
  }

  private isUniqueViolation(err: unknown): boolean {
    return (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code?: string }).code === '23505'
    );
  }
}
