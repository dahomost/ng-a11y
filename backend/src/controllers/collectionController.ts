import type { Request, Response } from 'express';
import type { Collection } from '../models';
import type { CollectionUpdateInput } from '../repositories/collectionRepository';
import type { CollectionService } from '../services/collectionService';
import { pathParam } from '../utils/routeParams';

function normalizeCollectionBody(
  body: Partial<Record<keyof Collection, unknown>>,
): Omit<Collection, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> {
  return {
    title: String(body.title),
    author: (body.author as string | null | undefined) ?? null,
    description: (body.description as string | null | undefined) ?? null,
    category: (body.category as string | null | undefined) ?? null,
    publishedDate: (body.publishedDate as string | null | undefined) ?? null,
    isbn: (body.isbn as string | null | undefined) ?? null,
    language: (body.language as string | null | undefined) ?? null,
  };
}

export class CollectionController {
  constructor(private readonly collections: CollectionService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const actorId = req.user!.id;
    const payload = normalizeCollectionBody(
      req.body as Record<string, unknown>,
    );
    const row = await this.collections.create(actorId, payload);
    res.status(201).json({ collection: row });
  };

  list = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.collections.list();
    res.status(200).json({ collections: items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const row = await this.collections.getById(pathParam(req, 'id'));
    res.status(200).json({ collection: row });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const actorId = req.user!.id;
    const patch = req.body as CollectionUpdateInput;
    const row = await this.collections.update(
      actorId,
      pathParam(req, 'id'),
      patch,
    );
    res.status(200).json({ collection: row });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const actorId = req.user!.id;
    await this.collections.remove(actorId, pathParam(req, 'id'));
    res.status(204).send();
  };
}
