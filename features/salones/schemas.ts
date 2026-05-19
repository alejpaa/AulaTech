import { z } from "zod";

export const salonSchema = z.object({
  nombre: z.string().trim().min(2),
  grado: z.string().trim().min(1),
  seccion: z.string().trim().min(1),
  nivel: z.string().trim().optional(),
});

export type SalonInput = z.infer<typeof salonSchema>;
