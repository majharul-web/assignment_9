import { z } from 'zod';

const userLoginZodSchema = z.object({
  body: z.object({
    password: z.string({ required_error: 'Password is required' }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email address' }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required',
    }),
  }),
});

export const AuthValidation = {
  userLoginZodSchema,
  refreshTokenZodSchema,
};
