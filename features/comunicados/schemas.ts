import { z } from "zod";
import { appRoles } from "@/lib/auth/roles";

export const comunicadoSchema = z.object({
  titulo: z.string().trim().min(3, "El titulo es obligatorio").max(160),
  contenido: z.string().trim().min(10, "El contenido es obligatorio"),
  destinatario: z.enum(appRoles).nullable().optional(),
  publicado: z.boolean().default(false),
});

export type ComunicadoInput = z.infer<typeof comunicadoSchema>;
