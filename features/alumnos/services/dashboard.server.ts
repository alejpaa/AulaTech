import { createSupabaseServerClient } from "@/lib/supabase/server";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export async function getDashboardAlumno(usuarioId: string) {
  const supabase = await createSupabaseServerClient();

  // 1. Obtener alumno_id
  const { data: alumnoData, error: alumnoError } = await supabase
    .from("alumnos")
    .select("id")
    .eq("usuario_id", usuarioId)
    .single();

  if (alumnoError || !alumnoData) {
    console.error("Error fetching alumno:", alumnoError);
    return {
      globalAverage: null,
      upcomingPayment: null,
      latestAnnouncement: null,
    };
  }

  const alumnoId = alumnoData.id;

  // 2. Obtener promedio global
  const { data: notasData } = await supabase
    .from("notas")
    .select("promedio")
    .eq("alumno_id", alumnoId)
    .not("promedio", "is", null);

  let globalAverage: number | null = null;
  if (notasData && notasData.length > 0) {
    const sum = notasData.reduce((acc, curr) => acc + (curr.promedio || 0), 0);
    globalAverage = sum / notasData.length;
  }

  // 3. Obtener el próximo pago pendiente (el más antiguo)
  const { data: pagosData } = await supabase
    .from("pagos")
    .select("anio, mes, monto, estado")
    .eq("alumno_id", alumnoId)
    .eq("estado", "pendiente")
    .order("anio", { ascending: true })
    .order("mes", { ascending: true })
    .limit(1)
    .single();

  let upcomingPayment = null;
  if (pagosData) {
    const monthName = MONTHS[pagosData.mes - 1] || "Mes Desconocido";
    upcomingPayment = {
      month: `${monthName} ${pagosData.anio}`,
      amount: pagosData.monto,
      status: "VENCIDA" as const, // Podría calcularse según fecha real, pero mantenemos compatibilidad UI
    };
  }

  // 4. Obtener último comunicado
  const { data: comunicadoData } = await supabase
    .from("comunicados")
    .select("titulo, contenido, created_at, destinatario")
    .eq("publicado", true)
    .or(`destinatario.eq.alumno,destinatario.is.null`)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  let latestAnnouncement = null;
  if (comunicadoData) {
    const date = new Date(comunicadoData.created_at);
    latestAnnouncement = {
      title: comunicadoData.titulo,
      date: `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
      tag: "ACADÉMICO", // En un caso real podría venir de una categoría de la BD
      excerpt: comunicadoData.contenido,
    };
  }

  // 5. Obtener porcentaje de asistencia
  const { data: asistenciaData } = await supabase
    .from("asistencia")
    .select("estado")
    .eq("alumno_id", alumnoId);

  let attendancePercentage: number | null = null;
  if (asistenciaData && asistenciaData.length > 0) {
    const total = asistenciaData.length;
    const presentesOTardes = asistenciaData.filter(
      (a) => a.estado === "presente" || a.estado === "tarde"
    ).length;
    attendancePercentage = Math.round((presentesOTardes / total) * 100);
  }

  return {
    globalAverage,
    upcomingPayment,
    latestAnnouncement,
    attendancePercentage,
  };
}

