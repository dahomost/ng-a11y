import type { Pool } from 'pg';
import { AuditLogRepository } from './repositories/auditLogRepository';
import { CollectionRepository } from './repositories/collectionRepository';
import { CollectionTagRepository } from './repositories/collectionTagRepository';
import { TagRepository } from './repositories/tagRepository';
import { UserRepository } from './repositories/userRepository';
import { AuditLogQueryService } from './services/auditLogQueryService';
import { AuditService } from './services/auditService';
import { AuthService } from './services/authService';
import { CollectionService } from './services/collectionService';
import { CollectionTagService } from './services/collectionTagService';
import { TagService } from './services/tagService';
import { UserService } from './services/userService';

/** Composition root — wires repositories into domain services */
export function createContainer(pool: Pool) {
  const userRepository = new UserRepository(pool);
  const collectionRepository = new CollectionRepository(pool);
  const tagRepository = new TagRepository(pool);
  const collectionTagRepository = new CollectionTagRepository(pool);
  const auditLogRepository = new AuditLogRepository(pool);

  const auditService = new AuditService(auditLogRepository);
  const authService = new AuthService(userRepository);
  const userService = new UserService(userRepository, auditService);
  const collectionService = new CollectionService(
    collectionRepository,
    auditService,
  );
  const tagService = new TagService(tagRepository, auditService);
  const collectionTagService = new CollectionTagService(
    collectionRepository,
    tagRepository,
    collectionTagRepository,
    auditService,
  );
  const auditLogQueryService = new AuditLogQueryService(auditLogRepository);

  return {
    authService,
    userService,
    collectionService,
    tagService,
    collectionTagService,
    auditLogQueryService,
  };
}

export type AppContainer = ReturnType<typeof createContainer>;
