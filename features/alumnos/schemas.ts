import { z } from "zod";

export const alumnoSearchSchema = z.object({
  apellidos: z.string().trim().optional(),
  nombres: z.string().trim().optional(),
  grado: z.string().trim().optional(),
});

export const alumnoSchema = z.object({
  nombres: z.string().trim().min(2),
  apellidos: z.string().trim().min(2),
  dni: z.string().trim().min(8).max(12).optional(),
  codigo: z.string().trim().optional(),
  salon_id: z.string().uuid().optional(),
});

export type AlumnoInput = z.infer<typeof alumnoSchema>;
export type AlumnoSearchInput = z.infer<typeof alumnoSearchSchema>;
