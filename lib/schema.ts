import { z } from 'zod';

export const enquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  company: z.string().optional(),
  customerType: z.enum(['sole-trader', 'limited', 'partnership', 'individual']),
  vatRegistered: z.union([z.boolean(), z.enum(['true','false'])]),
  preferredTermMonths: z.number(),
  preferredMileage: z.number(),
  initialPaymentMultiple: z.number(),
  notes: z.string().optional(),
  consent: z.boolean(),
  marketingOptIn: z.boolean().optional()
});