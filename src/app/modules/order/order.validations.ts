import { z } from 'zod';

const createOrderZodSchema = z.object({
  body: z.object({
    serviceItems: z
      .array(
        z.object({
          serviceId: z.string({ required_error: 'Book id is required' }),
          quantity: z.number({ required_error: 'Book quantity is required' }),
        })
      )
      .refine(orderedBooks => orderedBooks.length > 0, {
        message: 'Service list must not be empty',
      }),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
};
