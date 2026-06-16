import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StudentProfileData = {
  id: string;
  codigo: string;
  nombres: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string | null;
  email: string;
  telefono: string | null;
  salon: {
    nombre: string;
    grado: string;
    seccion: string;
    nivel: string;
  } | null;
  stats: {
    promedioGlobal: number | null;
    porcentajeAsistencia: number | null;
  };
};

export async function getMiPerfil(usuarioId: string): Promise<StudentProfileData | null> {
  const supabase = await createSupabaseServerClient();

  // 1. Obtener datos del alumno cruzado con usuarios y salones
  const { data: alumnoData, error: alumnoError } = await supabase
    .from("alumnos")
    .select(`
      id,
      codigo,
      nombres,
      apellidos,
      dni,
      fecha_nacimiento,
      usuarios:usuarios!alumnos_usuario_id_fkey(email, telefono),
      salones(nombre, grado, seccion, nivel)
    `)
    .eq("usuario_id", usuarioId)
    .single();

  if (alumnoError && alumnoError.code !== "PGRST116") {
    console.error("Error fetching student profile:", alumnoError);
  }

  if (alumnoError || !alumnoData) {
    return null;
  }

  const alumnoId = alumnoData.id;

  // 2. Calcular promedio global
  const { data: notasData } = await supabase
    .from("notas")
    .select("promedio")
    .eq("alumno_id", alumnoId)
    .not("promedio", "is", null);

  let promedioGlobal: number | null = null;
  if (notasData && notasData.length > 0) {
    const sum = notasData.reduce((acc, curr) => acc + (curr.promedio || 0), 0);
    promedioGlobal = sum / notasData.length;
  }

  // 3. Calcular porcentaje de asistencia
  const { data: asistenciaData } = await supabase
    .from("asistencia")
    .select("estado")
    .eq("alumno_id", alumnoId);

  let porcentajeAsistencia: number | null = null;
  if (asistenciaData && asistenciaData.length > 0) {
    const total = asistenciaData.length;
    const presentesOTardes = asistenciaData.filter(
      (a) => a.estado === "presente" || a.estado === "tarde"
    ).length;
    porcentajeAsistencia = Math.round((presentesOTardes / total) * 100);
  }

  // Mapeo final
  const userRow = alumnoData.usuarios as any;
  const salonRow = alumnoData.salones as any;

  return {
    id: alumnoData.id,
    codigo: alumnoData.codigo || "C-000000",
    nombres: alumnoData.nombres,
    apellidos: alumnoData.apellidos,
    dni: alumnoData.dni || "—",
    fechaNacimiento: alumnoData.fecha_nacimiento || null,
    email: userRow?.email || "",
    telefono: userRow?.telefono || "—",
    salon: salonRow ? {
      nombre: salonRow.nombre,
      grado: salonRow.grado,
      seccion: salonRow.seccion,
      nivel: salonRow.nivel || "Secundaria",
    } : null,
    stats: {
      promedioGlobal,
      porcentajeAsistencia,
    },
  };
}
