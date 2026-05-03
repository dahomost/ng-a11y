import type { Request, Response } from 'express';
import type { AuthService } from '../services/authService';

export class AuthController {
  constructor(private readonly auth: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as { email: string; password: string };
    const result = await this.auth.register(email, password);
    res.status(201).json(result);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as { email: string; password: string };
    const result = await this.auth.login(email, password);
    res.status(200).json(result);
  };
}
