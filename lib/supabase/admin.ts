import { createSupabaseServerClient } from "./server";

const MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

type SalonRow = {
  id: string;
  nombre: string;
  grado: string;
  seccion: string;
  nivel: string | null;
};

type AlumnoRow = {
  id: string;
  codigo: string | null;
  nombres: string;
  apellidos: string;
  dni: string | null;
  activo: boolean;
  salon_id: string | null;
};

type ProfesorRow = {
  id: string;
  codigo: string | null;
  nombres: string;
  apellidos: string;
  dni: string | null;
  especialidad: string | null;
  activo: boolean;
};

type NotaRow = {
  id: string;
  alumno_id: string;
  curso_id: string;
  bimestre_id: string;
  nota_mensual: number | null;
  nota_bimestral: number | null;
  promedio: number | null;
  created_at: string;
};

type PagoRow = {
  id: string;
  alumno_id: string;
  anio: number;
  mes: number;
  estado: "pagado" | "pendiente";
  monto: number | null;
  fecha_pago: string | null;
  created_at: string;
};

type SimpleMapRow = {
  id: string;
  nombre?: string | null;
  nombres?: string | null;
  apellidos?: string | null;
  codigo?: string | null;
  dni?: string | null;
  grado?: string | null;
  seccion?: string | null;
  nivel?: string | null;
  salon_id?: string | null;
};

export type AdminAlumnoItem = AlumnoRow & {
  salon_nombre: string | null;
  salon_grado: string | null;
  salon_seccion: string | null;
  salon_nivel: string | null;
};

export type AdminProfesorItem = ProfesorRow;

export type AdminSalonItem = SalonRow & {
  activo: boolean;
};

export type AdminNotaItem = {
  id: string;
  alumno_id: string;
  alumno: string;
  salon_nombre: string | null;
  curso: string;
  bimestre: string;
  nota_mensual: number | null;
  nota_bimestral: number | null;
  promedio: number | null;
};

export type AdminPagoItem = {
  id: string;
  alumno: string;
  alumno_dni: string | null;
  periodo: string;
  estado: "pagado" | "pendiente";
  monto: number | null;
  fecha_pago: string | null;
};

export async function getNextSequentialCode(table: "alumnos" | "profesores", prefix: string): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(table)
    .select("codigo")
    .ilike("codigo", `${prefix}%`);

  if (error) {
    console.error(`Error loading codes for ${table}:`, error);
    return `${prefix}001`;
  }

  const nextNumber = (data ?? []).reduce((max, row: { codigo: string | null }) => {
    if (!row.codigo || !row.codigo.startsWith(prefix)) {
      return max;
    }

    const parsed = Number.parseInt(row.codigo.slice(prefix.length), 10);
    return Number.isFinite(parsed) && parsed > max ? parsed : max;
  }, 0) + 1;

  return `${prefix}${String(nextNumber).padStart(3, "0")}`;
}

export async function getAdminAlumnos(): Promise<AdminAlumnoItem[]> {
  const supabase = await createSupabaseServerClient();
  const [alumnosResult, salonesResult] = await Promise.all([
    supabase.from("alumnos").select("id, codigo, nombres, apellidos, dni, activo, salon_id").order("apellidos", { ascending: true }).order("nombres", { ascending: true }),
    supabase.from("salones").select("id, nombre, grado, seccion, nivel"),
  ]);

  if (alumnosResult.error || salonesResult.error) {
    console.error("Error loading admin alumnos:", alumnosResult.error ?? salonesResult.error);
    return [];
  }

  const salonesById = new Map((salonesResult.data ?? []).map((row: SalonRow) => [row.id, row]));

  return (alumnosResult.data ?? []).map((alumno: AlumnoRow) => {
    const salon = alumno.salon_id ? salonesById.get(alumno.salon_id) : null;

    return {
      ...alumno,
      salon_nombre: salon?.nombre ?? null,
      salon_grado: salon?.grado ?? null,
      salon_seccion: salon?.seccion ?? null,
      salon_nivel: salon?.nivel ?? null,
    };
  });
}

export async function getAdminProfesores(): Promise<AdminProfesorItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profesores")
    .select("id, codigo, nombres, apellidos, dni, especialidad, activo")
    .order("apellidos", { ascending: true })
    .order("nombres", { ascending: true });

  if (error) {
    console.error("Error loading admin profesores:", error);
    return [];
  }

  return (data ?? []) as AdminProfesorItem[];
}

export async function getAdminSalones(): Promise<AdminSalonItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("salones")
    .select("id, nombre, grado, seccion, nivel, activo")
    .order("grado", { ascending: true })
    .order("seccion", { ascending: true });

  if (error) {
    console.error("Error loading admin salones:", error);
    return [];
  }

  return (data ?? []) as AdminSalonItem[];
}

export async function getAdminNotas(): Promise<AdminNotaItem[]> {
  const supabase = await createSupabaseServerClient();
  const [notasResult, alumnosResult, cursosResult, bimestresResult] = await Promise.all([
    supabase
      .from("notas")
      .select("id, alumno_id, curso_id, bimestre_id, nota_mensual, nota_bimestral, promedio, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("alumnos").select("id, nombres, apellidos, salon_id"),
    supabase.from("cursos").select("id, nombre"),
    supabase.from("bimestres").select("id, nombre"),
  ]);

  if (notasResult.error || alumnosResult.error || cursosResult.error || bimestresResult.error) {
    console.error("Error loading admin notas:", notasResult.error ?? alumnosResult.error ?? cursosResult.error ?? bimestresResult.error);
    return [];
  }

  const alumnosById = new Map((alumnosResult.data ?? []).map((row: SimpleMapRow) => [row.id, row]));
  const cursosById = new Map((cursosResult.data ?? []).map((row: SimpleMapRow) => [row.id, row]));
  const bimestresById = new Map((bimestresResult.data ?? []).map((row: SimpleMapRow) => [row.id, row]));
  const salonesResult = await supabase.from("salones").select("id, nombre");

  if (salonesResult.error) {
    console.error("Error loading salones for admin notas:", salonesResult.error);
    return [];
  }

  const salonesById = new Map((salonesResult.data ?? []).map((row: SimpleMapRow) => [row.id, row]));

  return (notasResult.data ?? []).map((nota: NotaRow) => {
    const alumno = alumnosById.get(nota.alumno_id);
    const curso = cursosById.get(nota.curso_id);
    const bimestre = bimestresById.get(nota.bimestre_id);
    const salon = alumno?.salon_id ? salonesById.get(alumno.salon_id) : null;

    return {
      id: nota.id,
      alumno_id: nota.alumno_id,
      alumno: alumno ? `${alumno.apellidos}, ${alumno.nombres}` : "Alumno no encontrado",
      salon_nombre: salon?.nombre ?? null,
      curso: curso?.nombre ?? "Curso no encontrado",
      bimestre: bimestre?.nombre ?? "Bimestre no encontrado",
      nota_mensual: nota.nota_mensual,
      nota_bimestral: nota.nota_bimestral,
      promedio: nota.promedio,
    };
  });
}

export async function getAdminPagos(): Promise<AdminPagoItem[]> {
  const supabase = await createSupabaseServerClient();
  const [pagosResult, alumnosResult] = await Promise.all([
    supabase
      .from("pagos")
      .select("id, alumno_id, anio, mes, estado, monto, fecha_pago, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("alumnos").select("id, nombres, apellidos, dni"),
  ]);

  if (pagosResult.error || alumnosResult.error) {
    console.error("Error loading admin pagos:", pagosResult.error ?? alumnosResult.error);
    return [];
  }

  const alumnosById = new Map((alumnosResult.data ?? []).map((row: SimpleMapRow) => [row.id, row]));

  return (pagosResult.data ?? []).map((pago: PagoRow) => {
    const alumno = alumnosById.get(pago.alumno_id);

    return {
      id: pago.id,
      alumno: alumno ? `${alumno.apellidos}, ${alumno.nombres}` : "Alumno no encontrado",
      alumno_dni: alumno?.dni ?? null,
      periodo: `${MONTHS[pago.mes - 1] ?? pago.mes} ${pago.anio}`,
      estado: pago.estado,
      monto: pago.monto,
      fecha_pago: pago.fecha_pago,
    };
  });
}