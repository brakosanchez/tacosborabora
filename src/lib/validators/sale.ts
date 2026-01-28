import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre es requerido'),
  price: z.number().min(0, 'El precio debe ser positivo'),
  category: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;