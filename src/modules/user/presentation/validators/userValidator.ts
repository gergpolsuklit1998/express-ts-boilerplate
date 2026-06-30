import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid user id format'),
});

export type CreateUserSchemaType = z.infer<typeof createUserSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
