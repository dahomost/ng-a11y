import { NotFoundError } from '../errors/AppError';
import type { Collection } from '../models';
import type {
  CollectionRepository,
  CollectionUpdateInput,
} from '../repositories/collectionRepository';
import type { AuditService } from './auditService';

export class CollectionService {
  constructor(
    private readonly collections: CollectionRepository,
    private readonly audit: AuditService,
  ) {}

  async create(
    actorId: string,
    input: Omit<Collection, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>,
  ): Promise<Collection> {
    const row = await this.collections.create({
      ...input,
      createdBy: actorId,
    });
    await this.audit.record({
      action: 'CREATE',
      entityType: 'collection',
      entityId: row.id,
      userId: actorId,
      metadata: { title: row.title },
    });
    return row;
  }

  async list(): Promise<Collection[]> {
    return this.collections.list();
  }

  async getById(id: string): Promise<Collection> {
    const row = await this.collections.findById(id);
    if (!row) {
      throw new NotFoundError('Collection not found');
    }
    return row;
  }

  async update(
    actorId: string,
    id: string,
    patch: CollectionUpdateInput,
  ): Promise<Collection> {
    const existing = await this.collections.findById(id);
    if (!existing) {
      throw new NotFoundError('Collection not found');
    }
    const row = await this.collections.update(id, patch);
    if (!row) {
      throw new NotFoundError('Collection not found');
    }
    await this.audit.record({
      action: 'UPDATE',
      entityType: 'collection',
      entityId: id,
      userId: actorId,
      metadata: { before: existing, after: row },
    });
    return row;
  }

  async remove(actorId: string, id: string): Promise<void> {
    const ok = await this.collections.delete(id);
    if (!ok) {
      throw new NotFoundError('Collection not found');
    }
    await this.audit.record({
      action: 'DELETE',
      entityType: 'collection',
      entityId: id,
      userId: actorId,
    });
  }
}
