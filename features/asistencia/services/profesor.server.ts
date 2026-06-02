import { createSupabaseServerClient } from "@/lib/supabase/server";

export type FiltroCurso = {
  id: string; // curso_profesor id (no usamos este directamente para registro, sino curso y salon)
  curso_id: string;
  salon_id: string;
  nombre: string; // "Matemática - 1A Secundaria"
};

export type FiltroBimestre = {
  id: string;
  nombre: string;
  numero: number;
};

export async function getFiltrosAsistencia() {
  const supabase = await createSupabaseServerClient();

  // 1. Obtener bimestres
  const { data: bimestresData } = await supabase
    .from("bimestres")
    .select("id, nombre, numero")
    .eq("activo", true)
    .order("numero", { ascending: true });

  // 2. Obtener cursos asignados al profesor actual
  // RLS (cursos_profesor_profesor_select_self) filtrará automáticamente.
  const { data: cursosData } = await supabase
    .from("cursos_profesor")
    .select(`
      id,
      curso_id,
      salon_id,
      cursos ( nombre ),
      salones ( grado, seccion, nivel )
    `);

  const cursos: FiltroCurso[] = (cursosData || []).map((cp: any) => {
    const cursoNombre = Array.isArray(cp.cursos) ? cp.cursos[0]?.nombre : cp.cursos?.nombre;
    const salon = Array.isArray(cp.salones) ? cp.salones[0] : cp.salones;
    const salonDesc = salon ? `${salon.grado} ${salon.seccion} ${salon.nivel || ''}`.trim() : '';
    
    return {
      id: cp.id,
      curso_id: cp.curso_id,
      salon_id: cp.salon_id,
      nombre: `${cursoNombre} - ${salonDesc}`,
    };
  });

  return {
    bimestres: (bimestresData || []) as FiltroBimestre[],
    cursos,
  };
}

export type AlumnoAsistencia = {
  alumno_id: string;
  codigo: string | null;
  nombres: string;
  apellidos: string;
  asistencia_id?: string; // Si ya existe registro
  estado: "presente" | "tarde" | "falta" | "justificado" | null;
};

export async function getRegistroAsistencia(
  cursoId: string,
  salonId: string,
  bimestreId: string,
  fecha: string
): Promise<AlumnoAsistencia[]> {
  const supabase = await createSupabaseServerClient();

  // 1. Traer todos los alumnos de ese salón (RLS filtrará por los asignados al profe)
  const { data: alumnosData } = await supabase
    .from("alumnos")
    .select("id, codigo, nombres, apellidos")
    .eq("salon_id", salonId)
    .eq("activo", true)
    .order("apellidos", { ascending: true });

  if (!alumnosData || alumnosData.length === 0) return [];

  // 2. Traer registros de asistencia existentes para esa fecha, curso y bimestre
  const alumnoIds = alumnosData.map((a) => a.id);
  const { data: asistenciaData } = await supabase
    .from("asistencia")
    .select("id, alumno_id, estado")
    .eq("curso_id", cursoId)
    .eq("bimestre_id", bimestreId)
    .eq("fecha", fecha)
    .in("alumno_id", alumnoIds);

  const asistenciaMap = new Map();
  if (asistenciaData) {
    asistenciaData.forEach((a) => {
      asistenciaMap.set(a.alumno_id, { id: a.id, estado: a.estado });
    });
  }

  // 3. Combinar datos
  return alumnosData.map((alumno) => {
    const registro = asistenciaMap.get(alumno.id);
    return {
      alumno_id: alumno.id,
      codigo: alumno.codigo,
      nombres: alumno.nombres,
      apellidos: alumno.apellidos,
      asistencia_id: registro?.id,
      estado: registro?.estado || null,
    };
  });
}
