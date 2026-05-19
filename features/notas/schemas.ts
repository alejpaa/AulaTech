import { z } from "zod";

const notaValue = z.coerce.number().min(0).max(20).nullable().optional();

export const notaSchema = z.object({
  alumno_id: z.string().uuid(),
  curso_id: z.string().uuid(),
  bimestre_id: z.string().uuid(),
  nota_mensual: notaValue,
  nota_bimestral: notaValue,
});

export const notasConsultaSchema = z.object({
  salon_id: z.string().uuid(),
  curso_id: z.string().uuid(),
  bimestre_id: z.string().uuid(),
});

export type NotaInput = z.infer<typeof notaSchema>;
export type NotasConsultaInput = z.infer<typeof notasConsultaSchema>;
