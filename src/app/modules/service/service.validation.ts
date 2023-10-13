import { z } from 'zod';

const createServiceZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title is required' }),
    description: z.string({ required_error: 'description is required' }),
    price: z.string({ required_error: 'price is required' }),
    img: z.string({ required_error: 'img is required' }),
  }),
});

const updateServiceZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.string().optional(),
    img: z.string().optional(),
  }),
});

export const ServiceValidation = {
  createServiceZodSchema,
  updateServiceZodSchema,
};
