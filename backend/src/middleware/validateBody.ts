import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

/** Validates JSON body with Zod and attaches parsed result to req.body */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      next(parsed.error);
      return;
    }
    req.body = parsed.data;
    next();
  };
}
