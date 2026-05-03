import type { Request, Response } from 'express';
import type { UserRole } from '../models';
import type { UserService } from '../services/userService';
import { pathParam } from '../utils/routeParams';

export class UserController {
  constructor(private readonly users: UserService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const actorId = req.user!.id;
    const { email, password, role } = req.body as {
      email: string;
      password: string;
      role: UserRole;
    };
    const user = await this.users.create(actorId, { email, password, role });
    res.status(201).json({ user });
  };

  list = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.users.list();
    res.status(200).json({ users });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const user = await this.users.getById(pathParam(req, 'id'));
    res.status(200).json({ user });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const actorId = req.user!.id;
    const patch = req.body as Partial<{
      email: string;
      password: string;
      role: UserRole;
    }>;
    const user = await this.users.update(actorId, pathParam(req, 'id'), patch);
    res.status(200).json({ user });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const actorId = req.user!.id;
    await this.users.remove(actorId, pathParam(req, 'id'));
    res.status(204).send();
  };
}
