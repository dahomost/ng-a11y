import { Router } from 'express';
import { z } from 'zod';
import { AuditLogController } from '../../controllers/auditLogController';
import { AuthController } from '../../controllers/authController';
import { CollectionController } from '../../controllers/collectionController';
import { CollectionTagController } from '../../controllers/collectionTagController';
import { TagController } from '../../controllers/tagController';
import { UserController } from '../../controllers/userController';
import type { AppContainer } from '../../container';
import { asyncHandler } from '../../middleware/asyncHandler';
import { requireAuth } from '../../middleware/authMiddleware';
import { requireMinRole, requireRole } from '../../middleware/roleMiddleware';
import { validateBody } from '../../middleware/validateBody';
import { validateParams } from '../../middleware/validateParams';
import {
  collectionCreateSchema,
  collectionTagBodySchema,
  collectionUpdateSchema,
  createUserSchema,
  loginSchema,
  registerSchema,
  tagCreateSchema,
  updateUserSchema,
} from '../../validation/schemas';

const idParam = validateParams(z.object({ id: z.string().uuid() }));
const collectionTagParams = validateParams(
  z.object({ id: z.string().uuid(), tagId: z.string().uuid() }),
);

/** Versioned REST surface mounted at `/api/v1` */
export function createV1Router(container: AppContainer): Router {
  const router = Router();

  const authController = new AuthController(container.authService);
  const userController = new UserController(container.userService);
  const collectionController = new CollectionController(
    container.collectionService,
  );
  const tagController = new TagController(container.tagService);
  const collectionTagController = new CollectionTagController(
    container.collectionTagService,
  );
  const auditLogController = new AuditLogController(
    container.auditLogQueryService,
  );

  router.post(
    '/auth/register',
    validateBody(registerSchema),
    asyncHandler(authController.register.bind(authController)),
  );

  router.post(
    '/auth/login',
    validateBody(loginSchema),
    asyncHandler(authController.login.bind(authController)),
  );

  const authed = Router();
  authed.use(requireAuth);

  authed.post(
    '/users',
    requireRole('ADMIN'),
    validateBody(createUserSchema),
    asyncHandler(userController.create.bind(userController)),
  );
  authed.get(
    '/users',
    requireRole('ADMIN'),
    asyncHandler(userController.list.bind(userController)),
  );
  authed.get(
    '/users/:id',
    requireRole('ADMIN'),
    idParam,
    asyncHandler(userController.getById.bind(userController)),
  );
  authed.patch(
    '/users/:id',
    requireRole('ADMIN'),
    idParam,
    validateBody(updateUserSchema),
    asyncHandler(userController.update.bind(userController)),
  );
  authed.delete(
    '/users/:id',
    requireRole('ADMIN'),
    idParam,
    asyncHandler(userController.remove.bind(userController)),
  );

  authed.post(
    '/collections',
    requireMinRole('LIBRARIAN'),
    validateBody(collectionCreateSchema),
    asyncHandler(collectionController.create.bind(collectionController)),
  );
  authed.get(
    '/collections',
    asyncHandler(collectionController.list.bind(collectionController)),
  );
  authed.get(
    '/collections/:id',
    idParam,
    asyncHandler(collectionController.getById.bind(collectionController)),
  );
  authed.patch(
    '/collections/:id',
    requireMinRole('LIBRARIAN'),
    idParam,
    validateBody(collectionUpdateSchema),
    asyncHandler(collectionController.update.bind(collectionController)),
  );
  authed.delete(
    '/collections/:id',
    requireMinRole('LIBRARIAN'),
    idParam,
    asyncHandler(collectionController.remove.bind(collectionController)),
  );

  authed.post(
    '/tags',
    requireMinRole('LIBRARIAN'),
    validateBody(tagCreateSchema),
    asyncHandler(tagController.create.bind(tagController)),
  );
  authed.get('/tags', asyncHandler(tagController.list.bind(tagController)));
  authed.delete(
    '/tags/:id',
    requireMinRole('LIBRARIAN'),
    idParam,
    asyncHandler(tagController.remove.bind(tagController)),
  );

  authed.post(
    '/collections/:id/tags',
    requireMinRole('LIBRARIAN'),
    idParam,
    validateBody(collectionTagBodySchema),
    asyncHandler(collectionTagController.add.bind(collectionTagController)),
  );
  authed.get(
    '/collections/:id/tags',
    idParam,
    asyncHandler(collectionTagController.list.bind(collectionTagController)),
  );
  authed.delete(
    '/collections/:id/tags/:tagId',
    requireMinRole('LIBRARIAN'),
    collectionTagParams,
    asyncHandler(collectionTagController.remove.bind(collectionTagController)),
  );

  authed.get(
    '/audit-logs',
    requireMinRole('LIBRARIAN'),
    asyncHandler(auditLogController.list.bind(auditLogController)),
  );

  router.use(authed);
  return router;
}
