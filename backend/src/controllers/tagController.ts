import type { Request, Response } from 'express';
import type { TagService } from '../services/tagService';
import { pathParam } from '../utils/routeParams';

export class TagController {
  constructor(private readonly tags: TagService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const actorId = req.user!.id;
    const { name } = req.body as { name: string };
    const tag = await this.tags.create(actorId, name);
    res.status(201).json({ tag });
  };

  list = async (_req: Request, res: Response): Promise<void> => {
    const tags = await this.tags.list();
    res.status(200).json({ tags });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const actorId = req.user!.id;
    await this.tags.remove(actorId, pathParam(req, 'id'));
    res.status(204).send();
  };
}
