"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth/session";

export type NotaGuardarInput = {
  alumno_id: string;
  curso_id: string;
  bimestre_id: string;
  nota_mensual: number | null;
  nota_bimestral: number | null;
};

export async function guardarNotasMasivas(registros: NotaGuardarInput[]) {
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

  // Preparar payload para upsert asegurando cálculo correcto del promedio en servidor
  const upsertData = registros.map(r => {
    let promedio = null;
    if (r.nota_mensual !== null && r.nota_bimestral !== null) {
      // Redondear promedio si es necesario o dejar exacto
      promedio = (r.nota_mensual + r.nota_bimestral) / 2;
    }

    return {
      alumno_id: r.alumno_id,
      curso_id: r.curso_id,
      bimestre_id: r.bimestre_id,
      nota_mensual: r.nota_mensual,
      nota_bimestral: r.nota_bimestral,
      promedio,
      profesor_id,
      updated_by: usuario_id,
    };
  });

  // Upsert en la tabla notas
  // constraint: unique (alumno_id, curso_id, bimestre_id)
  const { error } = await supabase
    .from("notas")
    .upsert(upsertData, {
      onConflict: "alumno_id, curso_id, bimestre_id",
      ignoreDuplicates: false
    });

  if (error) {
    console.error("Error guardando notas:", error);
    return { success: false, error: "No se pudieron guardar las notas. Revisa los permisos." };
  }

  revalidatePath("/profesor/notas");
  return { success: true };
}
