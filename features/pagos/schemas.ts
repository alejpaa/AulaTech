import { z } from "zod";

export const pagoSchema = z.object({
  alumno_id: z.string().uuid(),
  anio: z.coerce.number().int().min(2000),
  mes: z.coerce.number().int().min(1).max(12),
  estado: z.enum(["pagado", "pendiente"]),
  monto: z.coerce.number().min(0).nullable().optional(),
  fecha_pago: z.string().date().nullable().optional(),
});

export const pagoSearchSchema = z.object({
  dni: z.string().trim().min(8).max(12),
});

export type PagoInput = z.infer<typeof pagoSchema>;
export type PagoSearchInput = z.infer<typeof pagoSearchSchema>;
