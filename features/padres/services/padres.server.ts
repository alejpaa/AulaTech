import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { NotaItem } from "@/features/notas/services/notas.server";
import type { PagoItem, PagosSummary } from "@/features/pagos/services/pagos.server";
import type {
  AsistenciaItem,
  AsistenciaStats,
  MonthlyAsistenciaStat,
} from "@/features/asistencia/services/asistencia.server";
import type { ComunicadoItem } from "@/features/comunicados/services/comunicados.server";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export type PadreChildItem = {
  id: string;
  codigo: string | null;
  nombres: string;
  apellidos: string;
  grado: string | null;
  seccion: string | null;
  nivel: string | null;
};

export type HijoDashboardSummary = {
  globalAverage: number | null;
  attendancePercentage: number | null;
  upcomingPayment: { month: string; amount: number; status: "VENCIDA" } | null;
  latestAnnouncement: { title: string; date: string; tag: string; excerpt: string } | null;
};

export async function getHijosDelPadre(usuarioId: string): Promise<PadreChildItem[]> {
  const supabase = await createSupabaseServerClient();

  const mapRows = (rows: any[] | null | undefined): PadreChildItem[] =>
    (rows || []).map((row: any) => ({
      id: row.id,
      codigo: row.codigo,
      nombres: row.nombres,
      apellidos: row.apellidos,
      grado: row.salones?.grado ?? null,
      seccion: row.salones?.seccion ?? null,
      nivel: row.salones?.nivel ?? null,
    }));

  console.log("🔍 Buscando hijos del padre con ID:", usuarioId);

  const { data, error } = await supabase
    .from("alumnos")
    .select(`id, codigo, nombres, apellidos, salones(grado, seccion, nivel)`)
    .eq("padre_usuario_id", usuarioId)
    .eq("activo", true)
    .order("nombres", { ascending: true });

  console.log("📊 Resultado primer query - Data:", data, "Error:", error);

  if (error) {
    console.error("❌ Error fetching hijos for padre:", error);
    return [];
  }

  if (data && data.length > 0) {
    console.log("✅ Encontrados hijos:", data.length);
    return mapRows(data);
  }

  console.log("⚠️ No se encontraron hijos en primer intento, intentando fallback con auth_user_id");

  const { data: parentProfile, error: parentError } = await supabase
    .from("usuarios")
    .select("auth_user_id")
    .eq("id", usuarioId)
    .single();

  if (parentError || !parentProfile?.auth_user_id) {
    console.error("❌ Error fetching padre profile for fallback lookup:", parentError);
    return [];
  }

  console.log("🔄 Intentando fallback con auth_user_id:", parentProfile.auth_user_id);

  const { data: fallbackData, error: fallbackError } = await supabase
    .from("alumnos")
    .select(`id, codigo, nombres, apellidos, salones(grado, seccion, nivel)`)
    .eq("padre_usuario_id", parentProfile.auth_user_id)
    .eq("activo", true)
    .order("nombres", { ascending: true });

  console.log("📊 Resultado fallback - Data:", fallbackData, "Error:", fallbackError);

  if (fallbackError) {
    console.error("❌ Error fetching hijos for padre using auth_user_id fallback:", fallbackError);
    return [];
  }

  if (fallbackData && fallbackData.length > 0) {
    console.log("✅ Encontrados hijos con fallback:", fallbackData.length);
  }

  return mapRows(fallbackData);
}

export async function getDashboardHijo(alumnoId: string): Promise<HijoDashboardSummary> {
  const supabase = await createSupabaseServerClient();

  const { data: notasData } = await supabase
    .from("notas")
    .select("promedio")
    .eq("alumno_id", alumnoId)
    .not("promedio", "is", null);

  let globalAverage: number | null = null;
  if (notasData && notasData.length > 0) {
    const sum = notasData.reduce((acc: number, item: any) => acc + Number(item.promedio || 0), 0);
    globalAverage = sum / notasData.length;
  }

  const { data: pagosData } = await supabase
    .from("pagos")
    .select("anio, mes, monto, estado")
    .eq("alumno_id", alumnoId)
    .eq("estado", "pendiente")
    .order("anio", { ascending: true })
    .order("mes", { ascending: true })
    .limit(1)
    .single();

  let upcomingPayment: { month: string; amount: number; status: "VENCIDA" } | null = null;
  if (pagosData) {
    const monthName = MONTHS[pagosData.mes - 1] || "Mes Desconocido";
    upcomingPayment = {
      month: `${monthName} ${pagosData.anio}`,
      amount: Number(pagosData.monto || 0),
      status: "VENCIDA",
    };
  }

  const { data: comunicadoData } = await supabase
    .from("comunicados")
    .select("titulo, contenido, created_at")
    .eq("publicado", true)
    .or(`destinatario.eq.alumno,destinatario.eq.padre,destinatario.is.null`)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  let latestAnnouncement = null;
  if (comunicadoData) {
    const date = new Date(comunicadoData.created_at);
    latestAnnouncement = {
      title: comunicadoData.titulo,
      date: `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
      tag: "ACADÉMICO",
      excerpt: comunicadoData.contenido,
    };
  }

  const { data: asistenciaData } = await supabase
    .from("asistencia")
    .select("estado")
    .eq("alumno_id", alumnoId);

  let attendancePercentage: number | null = null;
  if (asistenciaData && asistenciaData.length > 0) {
    const total = asistenciaData.length;
    const presentes = asistenciaData.filter(
      (item: any) => item.estado === "presente" || item.estado === "tarde"
    ).length;
    attendancePercentage = Math.round((presentes / total) * 100);
  }

  return {
    globalAverage,
    upcomingPayment,
    latestAnnouncement,
    attendancePercentage,
  };
}

export async function getNotasHijo(alumnoId: string): Promise<NotaItem[]> {
  const supabase = await createSupabaseServerClient();

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
    .eq("alumno_id", alumnoId)
    .order("cursos(nombre)");

  if (error) {
    console.error("Error fetching notas for hijo:", error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    curso: row.cursos?.nombre || "Curso desconocido",
    bimestre: row.bimestres?.nombre || "Bimestre desconocido",
    bimestre_numero: row.bimestres?.numero || 0,
    nota_mensual: row.nota_mensual,
    nota_bimestral: row.nota_bimestral,
    promedio: row.promedio,
  }));
}

export async function getAsistenciaHijo(alumnoId: string, bimestreId?: string) {
  const supabase = await createSupabaseServerClient();

  const { data: bimestresData, error: bimestresError } = await supabase
    .from("bimestres")
    .select("id, nombre, numero")
    .eq("activo", true)
    .order("numero", { ascending: true });

  if (bimestresError) {
    console.error("Error fetching bimestres for padre:", bimestresError);
  }

  const bimestres = bimestresData || [];
  let selectedBimestreId = bimestreId;

  if (!selectedBimestreId && bimestres.length > 0) {
    selectedBimestreId = bimestres[0].id;
  }

  if (!selectedBimestreId) {
    return {
      bimestres,
      selectedBimestreId: null,
      asistencias: [] as AsistenciaItem[],
      stats: { presente: 0, tarde: 0, falta: 0, justificado: 0, total: 0, porcentajeAsistencia: 0 },
      monthlyStats: [] as MonthlyAsistenciaStat[],
    };
  }

  const { data: asistenciaData, error: asistenciaError } = await supabase
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

  if (asistenciaError) {
    console.error("Error fetching asistencia for hijo:", asistenciaError);
  }

  const asistencias: AsistenciaItem[] = (asistenciaData || []).map((row: any) => ({
    id: row.id,
    fecha: row.fecha,
    semana: row.semana,
    estado: row.estado,
    curso: row.cursos?.nombre || "General/Tutoría",
  }));

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
    stats.porcentajeAsistencia = Math.round(((stats.presente + stats.tarde) / stats.total) * 100);
  }

  const monthlyCounts: Record<string, number> = {};

  asistencias.forEach((item) => {
    if (item.estado === "falta" || item.estado === "justificado") {
      const parts = item.fecha.split("-");
      if (parts.length >= 2) {
        const monthNum = parseInt(parts[1], 10);
        const monthName = MONTHS[monthNum - 1] || "Otro";
        monthlyCounts[monthName] = (monthlyCounts[monthName] || 0) + 1;
      }
    }
  });

  const monthlyStats = MONTHS.map((monthName) => ({
    name: monthName,
    inasistencias: monthlyCounts[monthName] || 0,
  })).filter((stat) => stat.inasistencias > 0 || Object.keys(monthlyCounts).includes(stat.name));

  if (monthlyStats.length === 0) {
    ["Marzo", "Abril", "Mayo"].forEach((monthName) => {
      monthlyStats.push({ name: monthName, inasistencias: 0 });
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

export async function getPagosHijo(alumnoId: string) {
  const supabase = await createSupabaseServerClient();

  const { data: pagosData, error: pagosError } = await supabase
    .from("pagos")
    .select("id, anio, mes, estado, monto, fecha_pago")
    .eq("alumno_id", alumnoId)
    .order("anio", { ascending: true })
    .order("mes", { ascending: true });

  if (pagosError) {
    console.error("Error fetching pagos for hijo:", pagosError);
  }

  const pagos: PagoItem[] = (pagosData || []).map((row: any) => ({
    id: row.id,
    anio: row.anio,
    mes: row.mes,
    mesNombre: MONTHS[row.mes - 1] || "Mes Desconocido",
    estado: row.estado,
    monto: Number(row.monto || 0),
    fechaPago: row.fecha_pago || null,
  }));

  const summary: PagosSummary = {
    totalPagados: 0,
    totalPendientes: 0,
    montoPendiente: 0,
    proximoVencimiento: null,
  };

  const pendingPayments = pagos.filter((pago) => pago.estado !== "pagado");

  pendingPayments.forEach((pago) => {
    summary.totalPendientes++;
    summary.montoPendiente += pago.monto;
  });

  if (pendingPayments.length > 0) {
    const oldestPending = pendingPayments.reduce<PagoItem | null>((current, next) => {
      if (!current) return next;
      if (next.anio < current.anio) return next;
      if (next.anio === current.anio && next.mes < current.mes) return next;
      return current;
    }, null);

    if (oldestPending) {
      summary.proximoVencimiento = `${oldestPending.mesNombre} ${oldestPending.anio}`;
    }
  }

  return {
    pagos,
    summary,
  };
}
