import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

/** Validates `req.params` (e.g. UUID segments) */
export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      next(parsed.error);
      return;
    }
    req.params = parsed.data as unknown as Request['params'];
    next();
  };
}
