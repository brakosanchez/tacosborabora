import { z } from 'zod'

export const contactoSchema = z.object({
  name: z.string().trim().min(1, 'name requerido').max(100),
  email: z.string().trim().email('email inválido').max(200),
  phone: z.string().trim().min(1, 'phone requerido').max(50).optional(),
  message: z.string().trim().min(1, 'message requerido').max(2000),
}).passthrough()

export type ContactoInput = z.infer<typeof contactoSchema>
