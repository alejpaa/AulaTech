"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth/session";

export type AsistenciaGuardarInput = {
  alumno_id: string;
  curso_id: string;
  bimestre_id: string;
  semana: number;
  fecha: string;
  estado: "presente" | "tarde" | "falta" | "justificado";
};

export async function guardarAsistenciaMasiva(registros: AsistenciaGuardarInput[]) {
  if (!registros || registros.length === 0) return { success: true };

  const profile = await getCurrentProfile();
  if (!profile) return { success: false, error: "No autorizado" };

  const supabase = await createSupabaseServerClient();

  // Obtener IDs de contexto
  const usuario_id = profile.id;
  const { data: profData, error: profError } = await supabase
    .from("profesores")
    .select("id")
    .eq("usuario_id", usuario_id)
    .single();

  if (profError || !profData) {
    return { success: false, error: "Profesor no encontrado" };
  }

  const profesor_id = profData.id;

  // Preparar payload para upsert
  const upsertData = registros.map(r => ({
    ...r,
    profesor_id,
    updated_by: usuario_id,
  }));

  // Upsert en la tabla asistencia (usa alumno_id, curso_id, fecha como constraint único por RLS)
  // Nota: El constraint real es unique (alumno_id, curso_id, fecha)
  const { error } = await supabase
    .from("asistencia")
    .upsert(upsertData, {
      onConflict: "alumno_id, curso_id, fecha",
      ignoreDuplicates: false
    });

  if (error) {
    console.error("Error guardando asistencia:", error);
    return { success: false, error: "No se pudo guardar la asistencia. Revisa los permisos." };
  }

  revalidatePath("/profesor/asistencia");
  return { success: true };
}
