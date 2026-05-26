import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AsistenciaEstado = "presente" | "tarde" | "falta" | "justificado";

export type AsistenciaItem = {
  id: string;
  fecha: string;
  semana: number;
  estado: AsistenciaEstado;
  curso: string;
};

export type AsistenciaStats = {
  presente: number;
  tarde: number;
  falta: number;
  justificado: number;
  total: number;
  porcentajeAsistencia: number;
};

export type MonthlyAsistenciaStat = {
  name: string;
  inasistencias: number;
};

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export async function getMiAsistencia(usuarioId: string, bimestreId?: string) {
  const supabase = await createSupabaseServerClient();

  // 1. Obtener los bimestres disponibles para el filtro
  const { data: bimestresData, error: bimestresError } = await supabase
    .from("bimestres")
    .select("id, nombre, numero")
    .eq("activo", true)
    .order("numero", { ascending: true });

  if (bimestresError) {
    console.error("Error fetching bimestres:", bimestresError);
  }

  const bimestres = bimestresData || [];

  // 2. Obtener el alumno_id correspondiente al usuario logueado
  const { data: alumnoData, error: alumnoError } = await supabase
    .from("alumnos")
    .select("id")
    .eq("usuario_id", usuarioId)
    .single();

  if (alumnoError || !alumnoData) {
    console.error("Error fetching alumno profile for attendance:", alumnoError);
    return {
      bimestres,
      selectedBimestreId: null,
      asistencias: [],
      stats: { presente: 0, tarde: 0, falta: 0, justificado: 0, total: 0, porcentajeAsistencia: 0 },
      monthlyStats: [],
    };
  }

  const alumnoId = alumnoData.id;

  // 3. Si no se especificó un bimestre, tomar el primero disponible
  let selectedBimestreId = bimestreId;
  if (!selectedBimestreId && bimestres.length > 0) {
    selectedBimestreId = bimestres[0].id;
  }

  if (!selectedBimestreId) {
    return {
      bimestres,
      selectedBimestreId: null,
      asistencias: [],
      stats: { presente: 0, tarde: 0, falta: 0, justificado: 0, total: 0, porcentajeAsistencia: 0 },
      monthlyStats: [],
    };
  }

  // 4. Obtener las asistencias del alumno en el bimestre seleccionado
  const { data: asistenciasData, error: asistenciasError } = await supabase
    .from("asistencia")
    .select(`
      id,
      fecha,
      semana,
      estado,
      cursos(nombre)
    `)
    .eq("alumno_id", alumnoId)
    .eq("bimestre_id", selectedBimestreId)
    .order("fecha", { ascending: false });

  if (asistenciasError) {
    console.error("Error fetching asistencia:", asistenciasError);
  }

  const rawAsistencias = asistenciasData || [];

  const asistencias: AsistenciaItem[] = rawAsistencias.map((row: any) => ({
    id: row.id,
    fecha: row.fecha,
    semana: row.semana,
    estado: row.estado as AsistenciaEstado,
    curso: row.cursos?.nombre || "General/Tutoría",
  }));

  // 5. Calcular estadísticas básicas
  const stats: AsistenciaStats = {
    presente: 0,
    tarde: 0,
    falta: 0,
    justificado: 0,
    total: asistencias.length,
    porcentajeAsistencia: 0,
  };

  asistencias.forEach((item) => {
    if (item.estado === "presente") stats.presente++;
    else if (item.estado === "tarde") stats.tarde++;
    else if (item.estado === "falta") stats.falta++;
    else if (item.estado === "justificado") stats.justificado++;
  });

  if (stats.total > 0) {
    // La asistencia se considera presente + tarde como asistencia positiva.
    // O podemos decir: (presente + tarde) / total
    stats.porcentajeAsistencia = Math.round(((stats.presente + stats.tarde) / stats.total) * 100);
  }

  // 6. Calcular inasistencias mensuales (agrupadas por mes)
  const monthlyCounts: Record<string, number> = {};

  asistencias.forEach((item) => {
    // Contamos inasistencias (faltas y justificadas)
    if (item.estado === "falta" || item.estado === "justificado") {
      const parts = item.fecha.split("-");
      if (parts.length >= 2) {
        const monthNum = parseInt(parts[1], 10);
        const monthName = MONTHS[monthNum - 1] || "Otro";
        monthlyCounts[monthName] = (monthlyCounts[monthName] || 0) + 1;
      }
    }
  });

  // Convertimos a array ordenado según el mes del año
  const monthlyStats: MonthlyAsistenciaStat[] = MONTHS.map((monthName) => ({
    name: monthName,
    inasistencias: monthlyCounts[monthName] || 0,
  })).filter((stat) => stat.inasistencias > 0 || Object.keys(monthlyCounts).includes(stat.name));

  // Si está vacío, rellenar al menos con los meses del periodo escolar para no ver un gráfico en blanco
  if (monthlyStats.length === 0) {
    // Por defecto mostrar meses escolares marzo, abril, mayo si es vacio
    const activeMonths = ["Marzo", "Abril", "Mayo"];
    activeMonths.forEach((m) => {
      monthlyStats.push({ name: m, inasistencias: 0 });
    });
  }

  return {
    bimestres,
    selectedBimestreId,
    asistencias,
    stats,
    monthlyStats,
  };
}
