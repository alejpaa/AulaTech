import { z } from "zod";

export const profesorSearchSchema = z.object({
  apellidos: z.string().trim().optional(),
  nombres: z.string().trim().optional(),
  especialidad: z.string().trim().optional(),
});

export const profesorSchema = z.object({
  nombres: z.string().trim().min(2),
  apellidos: z.string().trim().min(2),
  dni: z.string().trim().min(8).max(12).optional(),
  codigo: z.string().trim().optional(),
  especialidad: z.string().trim().optional(),
});

export type ProfesorInput = z.infer<typeof profesorSchema>;
export type ProfesorSearchInput = z.infer<typeof profesorSearchSchema>;
