import type { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors/AppError';
import type { UserRole } from '../models';

const roleRank: Record<UserRole, number> = {
  PUBLIC: 1,
  LIBRARIAN: 2,
  ADMIN: 3,
};

/**
 * Requires at least the lowest listed role (higher roles also pass).
 * Example: requireMinRole('LIBRARIAN') allows LIBRARIAN and ADMIN.
 */
export function requireMinRole(...allowed: UserRole[]) {
  const threshold = Math.min(...allowed.map((r) => roleRank[r]));

  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user) {
      next(new ForbiddenError());
      return;
    }
    if (roleRank[user.role] < threshold) {
      next(new ForbiddenError('Insufficient permissions'));
      return;
    }
    next();
  };
}

/** Exact role match (any of) */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      next(new ForbiddenError('Insufficient permissions'));
      return;
    }
    next();
  };
}
