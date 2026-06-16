import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getFiltrosAsistencia } from "@/features/asistencia/services/profesor.server";

// Reutilizamos los filtros ya que la asignación de cursos y bimestres es la misma
export const getFiltrosNotas = getFiltrosAsistencia;

export type AlumnoNota = {
  alumno_id: string;
  codigo: string | null;
  nombres: string;
  apellidos: string;
  nota_id?: string;
  nota_mensual: number | null;
  nota_bimestral: number | null;
  promedio: number | null;
};

export async function getRegistroNotas(
  cursoId: string,
  salonId: string,
  bimestreId: string
): Promise<AlumnoNota[]> {
  const supabase = await createSupabaseServerClient();

  // 1. Traer alumnos del salón asignado
  const { data: alumnosData } = await supabase
    .from("alumnos")
    .select("id, codigo, nombres, apellidos")
    .eq("salon_id", salonId)
    .eq("activo", true)
    .order("apellidos", { ascending: true });

  if (!alumnosData || alumnosData.length === 0) return [];

  // 2. Traer registros de notas existentes
  const alumnoIds = alumnosData.map((a) => a.id);
  const { data: notasData } = await supabase
    .from("notas")
    .select("id, alumno_id, nota_mensual, nota_bimestral, promedio")
    .eq("curso_id", cursoId)
    .eq("bimestre_id", bimestreId)
    .in("alumno_id", alumnoIds);

  const notasMap = new Map();
  if (notasData) {
    notasData.forEach((n) => {
      notasMap.set(n.alumno_id, n);
    });
  }

  // 3. Combinar datos
  return alumnosData.map((alumno) => {
    const registro = notasMap.get(alumno.id);
    return {
      alumno_id: alumno.id,
      codigo: alumno.codigo,
      nombres: alumno.nombres,
      apellidos: alumno.apellidos,
      nota_id: registro?.id,
      nota_mensual: registro?.nota_mensual ?? null,
      nota_bimestral: registro?.nota_bimestral ?? null,
      promedio: registro?.promedio ?? null,
    };
  });
}
