import { NotFoundError } from '../errors/AppError';
import type { Tag } from '../models';
import type { CollectionRepository } from '../repositories/collectionRepository';
import type { CollectionTagRepository } from '../repositories/collectionTagRepository';
import type { TagRepository } from '../repositories/tagRepository';
import type { AuditService } from './auditService';

export class CollectionTagService {
  constructor(
    private readonly collections: CollectionRepository,
    private readonly tags: TagRepository,
    private readonly links: CollectionTagRepository,
    private readonly audit: AuditService,
  ) {}

  async addTag(
    actorId: string,
    collectionId: string,
    tagId: string,
  ): Promise<Tag[]> {
    const col = await this.collections.findById(collectionId);
    if (!col) {
      throw new NotFoundError('Collection not found');
    }
    const tag = await this.tags.findById(tagId);
    if (!tag) {
      throw new NotFoundError('Tag not found');
    }
    await this.links.add(collectionId, tagId);
    await this.audit.record({
      action: 'CREATE',
      entityType: 'collection_tag',
      entityId: collectionId,
      userId: actorId,
      metadata: { tagId },
    });
    return this.links.listByCollection(collectionId);
  }

  async listTags(collectionId: string): Promise<Tag[]> {
    const col = await this.collections.findById(collectionId);
    if (!col) {
      throw new NotFoundError('Collection not found');
    }
    return this.links.listByCollection(collectionId);
  }

  async removeTag(
    actorId: string,
    collectionId: string,
    tagId: string,
  ): Promise<void> {
    const col = await this.collections.findById(collectionId);
    if (!col) {
      throw new NotFoundError('Collection not found');
    }
    const ok = await this.links.remove(collectionId, tagId);
    if (!ok) {
      throw new NotFoundError('Association not found');
    }
    await this.audit.record({
      action: 'DELETE',
      entityType: 'collection_tag',
      entityId: collectionId,
      userId: actorId,
      metadata: { tagId },
    });
  }
}
