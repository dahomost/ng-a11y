import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import type { UserRole } from '../models';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export function signToken(payload: JwtPayload): string {
  const options = { expiresIn: env.jwtExpiresIn } as SignOptions;
  return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.jwtSecret);
  if (typeof decoded === 'string' || !decoded || typeof decoded !== 'object') {
    throw new Error('Invalid token payload');
  }
  const { sub, email, role } = decoded as Record<string, unknown>;
  if (
    typeof sub !== 'string' ||
    typeof email !== 'string' ||
    typeof role !== 'string'
  ) {
    throw new Error('Invalid token claims');
  }
  return { sub, email, role: role as JwtPayload['role'] };
}
