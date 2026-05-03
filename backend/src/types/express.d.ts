import type { UserRole } from '../models';

declare global {
  namespace Express {
    interface Request {
      /** Set by auth middleware after JWT verification */
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export {};
