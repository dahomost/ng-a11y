import type { Request } from 'express';

/** Single path segment after route validation (avoids `string | string[]` noise) */
export function pathParam(req: Request, key: string): string {
  const v = req.params[key];
  if (Array.isArray(v)) {
    return v[0] ?? '';
  }
  return v ?? '';
}
