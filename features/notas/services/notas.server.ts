import { createSupabaseServerClient } from "@/lib/supabase/server";

export type NotaItem = {
  id: string;
  curso: string;
  bimestre: string;
  bimestre_numero: number;
  nota_mensual: number | null;
  nota_bimestral: number | null;
  promedio: number | null;
};

export async function getMisNotas(usuarioId: string): Promise<NotaItem[]> {
  const supabase = await createSupabaseServerClient();

  // Primero obtener el alumno_id correspondiente al usuario
  const { data: alumnoData, error: alumnoError } = await supabase
    .from("alumnos")
    .select("id")
    .eq("usuario_id", usuarioId)
    .single();

  if (alumnoError || !alumnoData) {
    console.error("Error fetching alumno:", alumnoError);
    return [];
  }

  // Traer las notas del alumno con información de cursos y bimestres
  const { data, error } = await supabase
    .from("notas")
    .select(`
      id,
      nota_mensual,
      nota_bimestral,
      promedio,
      cursos(nombre),
      bimestres(nombre, numero)
    `)
    .eq("alumno_id", alumnoData.id)
    .order('cursos(nombre)');

  if (error) {
    console.error("Error fetching notas:", error);
    return [];
  }

  // Mapear al tipo NotaItem
  return data.map((row: any) => ({
    id: row.id,
    curso: row.cursos?.nombre || "Curso desconocido",
    bimestre: row.bimestres?.nombre || "Bimestre desconocido",
    bimestre_numero: row.bimestres?.numero || 0,
    nota_mensual: row.nota_mensual,
    nota_bimestral: row.nota_bimestral,
    promedio: row.promedio,
  }));
}
