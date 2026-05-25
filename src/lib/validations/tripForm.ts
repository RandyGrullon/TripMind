import { z } from 'zod'

export const tripFormSchema = z.object({
  title: z.string().min(1).max(100),
  destination: z.string().min(1).max(200),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  budget: z.number().positive(),
  currency: z.string().length(3),
  travelers: z.number().int().positive().max(50),
  packageType: z.enum(['budget', 'standard', 'premium', 'luxury']),
})

export type TripFormData = z.infer<typeof tripFormSchema>
