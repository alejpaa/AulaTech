import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PagoEstado = "pagado" | "pendiente";

export type PagoItem = {
  id: string;
  anio: number;
  mes: number;
  mesNombre: string;
  estado: PagoEstado;
  monto: number;
  fechaPago: string | null;
};

export type PagosSummary = {
  totalPagados: number;
  totalPendientes: number;
  montoPendiente: number;
  proximoVencimiento: string | null;
};

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export async function getMisPagos(usuarioId: string) {
  const supabase = await createSupabaseServerClient();

  // 1. Obtener el alumno_id correspondiente al usuario logueado
  const { data: alumnoData, error: alumnoError } = await supabase
    .from("alumnos")
    .select("id")
    .eq("usuario_id", usuarioId)
    .single();

  if (alumnoError || !alumnoData) {
    console.error("Error fetching alumno profile for payments:", alumnoError);
    return {
      pagos: [],
      summary: {
        totalPagados: 0,
        totalPendientes: 0,
        montoPendiente: 0,
        proximoVencimiento: null,
      },
    };
  }

  const alumnoId = alumnoData.id;

  // 2. Consultar todos los pagos del alumno
  const { data: pagosData, error: pagosError } = await supabase
    .from("pagos")
    .select("id, anio, mes, estado, monto, fecha_pago")
    .eq("alumno_id", alumnoId)
    .order("anio", { ascending: true })
    .order("mes", { ascending: true });

  if (pagosError) {
    console.error("Error fetching pagos from DB:", pagosError);
  }

  const rawPagos = pagosData || [];

  // 3. Mapear a tipos e idiomas locales
  const pagos: PagoItem[] = rawPagos.map((row: any) => ({
    id: row.id,
    anio: row.anio,
    mes: row.mes,
    mesNombre: MONTHS[row.mes - 1] || "Mes Desconocido",
    estado: row.estado as PagoEstado,
    monto: Number(row.monto || 0),
    fechaPago: row.fecha_pago || null,
  }));

  // 4. Calcular el resumen
  const summary: PagosSummary = {
    totalPagados: 0,
    totalPendientes: 0,
    montoPendiente: 0,
    proximoVencimiento: null,
  };

  let oldestPending: PagoItem | null = null;

  pagos.forEach((pago) => {
    if (pago.estado === "pagado") {
      summary.totalPagados++;
    } else {
      summary.totalPendientes++;
      summary.montoPendiente += pago.monto;

      // Buscar el pendiente más antiguo
      if (!oldestPending) {
        oldestPending = pago;
      } else if (pago.anio < oldestPending.anio || (pago.anio === oldestPending.anio && pago.mes < oldestPending.mes)) {
        oldestPending = pago;
      }
    }
  });

  if (oldestPending) {
    summary.proximoVencimiento = `${(oldestPending as PagoItem).mesNombre} ${(oldestPending as PagoItem).anio}`;
  }

  return {
    pagos,
    summary,
  };
}
