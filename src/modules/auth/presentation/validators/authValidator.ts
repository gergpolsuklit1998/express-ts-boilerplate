import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RefreshTokenSchemaType = z.infer<typeof refreshTokenSchema>;
