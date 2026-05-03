import type { Request, Response } from 'express';
import type { CollectionTagService } from '../services/collectionTagService';
import { pathParam } from '../utils/routeParams';

export class CollectionTagController {
  constructor(private readonly svc: CollectionTagService) {}

  add = async (req: Request, res: Response): Promise<void> => {
    const actorId = req.user!.id;
    const { tagId } = req.body as { tagId: string };
    const tags = await this.svc.addTag(actorId, pathParam(req, 'id'), tagId);
    res.status(201).json({ tags });
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const tags = await this.svc.listTags(pathParam(req, 'id'));
    res.status(200).json({ tags });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const actorId = req.user!.id;
    await this.svc.removeTag(
      actorId,
      pathParam(req, 'id'),
      pathParam(req, 'tagId'),
    );
    res.status(204).send();
  };
}
