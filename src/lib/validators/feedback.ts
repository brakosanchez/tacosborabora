import { z } from 'zod'

export const feedbackSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().email().max(200).optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1).max(2000).optional(),
  visit_date: z.string().trim().min(1).max(20).optional(),
}).passthrough()

export type FeedbackInput = z.infer<typeof feedbackSchema>
