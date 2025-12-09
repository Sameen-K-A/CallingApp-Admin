import { z } from 'zod';

export const createPlanSchema = z.object({
  amount: z
    .number()
    .int('Amount must be a whole number')
    .positive('Amount must be greater than 0')
    .max(50000, 'Amount cannot exceed ₹50,000'),

  coins: z
    .number()
    .int('Coins must be a whole number')
    .positive('Coins must be greater than 0')
    .max(1000000, 'Coins cannot exceed 10,00,000'),

  discountPercentage: z
    .number()
    .int('Discount must be a whole number')
    .min(0, 'Discount cannot be negative')
    .max(99, 'Discount cannot exceed 99%'),
});

export const editPlanSchema = z.object({
  amount: z
    .number()
    .int('Amount must be a whole number')
    .positive('Amount must be greater than 0')
    .max(50000, 'Amount cannot exceed ₹50,000')
    .optional(),

  coins: z
    .number()
    .int('Coins must be a whole number')
    .positive('Coins must be greater than 0')
    .max(1000000, 'Coins cannot exceed 10,00,000')
    .optional(),

  discountPercentage: z
    .number()
    .int('Discount must be a whole number')
    .min(0, 'Discount cannot be negative')
    .max(99, 'Discount cannot exceed 99%')
    .optional(),

  isActive: z
    .boolean()
    .optional(),
}).refine(
  (data) => { return Object.values(data).some(value => value !== undefined) },
  { message: 'At least one field must be updated' }
);

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type EditPlanInput = z.infer<typeof editPlanSchema>;