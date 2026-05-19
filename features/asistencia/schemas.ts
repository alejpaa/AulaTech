import { z } from "zod";

export const asistenciaSchema = z.object({
  alumno_id: z.string().uuid(),
  curso_id: z.string().uuid().nullable().optional(),
  bimestre_id: z.string().uuid(),
  semana: z.coerce.number().int().min(1).max(12),
  fecha: z.string().date(),
  estado: z.enum(["presente", "tarde", "falta", "justificado"]),
});

export type AsistenciaInput = z.infer<typeof asistenciaSchema>;
