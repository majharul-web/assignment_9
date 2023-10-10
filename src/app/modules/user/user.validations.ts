import { userRole } from '@prisma/client';
import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.enum([...Object.values(userRole)] as [string, ...string[]], {}),
    contactNo: z.string({
      required_error: 'Phone number is required',
    }),
    // .refine(value => /^(?:\+?88)?01[13-9]\d{8}$/.test(value), {
    //   message: 'Invalid Bangladeshi phone number',
    // }),
    address: z.string(),
    profileImg: z.string(),
  }),
});

const updateUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
    role: z
      .enum([...Object.values(userRole)] as [string, ...string[]], {})
      .optional(),
    contactNo: z.string().optional(),
    // .refine(
    //   value => value === undefined || /^(?:\+?88)?01[13-9]\d{8}$/.test(value),
    //   {
    //     message: 'Invalid Bangladeshi phone number',
    //   }
    // )
    address: z.string().optional(),
    profileImg: z.string().optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
