import { z } from 'zod';

const userRole = z.enum(['PUBLIC', 'LIBRARIAN', 'ADMIN']);

export const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
});

export const loginSchema = registerSchema;

export const createUserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  role: userRole,
});

export const updateUserSchema = z
  .object({
    email: z.string().email().max(255).optional(),
    password: z.string().min(8).max(128).optional(),
    role: userRole.optional(),
  })
  .refine(
    (v) =>
      v.email !== undefined || v.password !== undefined || v.role !== undefined,
    {
      message: 'At least one field required',
    },
  );

export const collectionCreateSchema = z.object({
  title: z.string().min(1).max(512),
  author: z.string().max(512).nullable().optional(),
  description: z.string().max(20_000).nullable().optional(),
  category: z.string().max(255).nullable().optional(),
  publishedDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  isbn: z.string().max(32).nullable().optional(),
  language: z.string().max(32).nullable().optional(),
});

export const collectionUpdateSchema = collectionCreateSchema.partial();

export const tagCreateSchema = z.object({
  name: z.string().min(1).max(255),
});

export const collectionTagBodySchema = z.object({
  tagId: z.string().uuid(),
});
