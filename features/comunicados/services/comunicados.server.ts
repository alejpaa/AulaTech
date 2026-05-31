import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ComunicadoItem = {
  id: string;
  titulo: string;
  contenido: string;
  fecha: string;
  tag: "REUNIÓN" | "ACADÉMICO";
  imageUrl: string;
  destinatario: "administrativo" | "profesor" | "alumno" | null;
};

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Unsplash premium educational stock photos
const IMAGES = {
  ACADEMICO_1: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop", // Graduation
  ACADEMICO_2: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop", // Books
  REUNION_1: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop", // Classroom
  REUNION_2: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop", // Teamwork
};

type ComunicadoRow = {
  id: string;
  titulo: string;
  contenido: string;
  destinatario: "administrativo" | "profesor" | "alumno" | null;
  created_at: string;
};

export type AdminComunicadosFilters = {
  titulo?: string;
  destinatario?: string;
};

function mapComunicados(rows: ComunicadoRow[]): ComunicadoItem[] {
  return rows.map((row) => {
    const textToAnalyze = `${row.titulo} ${row.contenido}`.toLowerCase();

    const isMeeting =
      textToAnalyze.includes("reunión") ||
      textToAnalyze.includes("reunion") ||
      textToAnalyze.includes("citación") ||
      textToAnalyze.includes("citacion") ||
      textToAnalyze.includes("padres") ||
      textToAnalyze.includes("asamblea") ||
      textToAnalyze.includes("convocatoria");

    const tag = isMeeting ? "REUNIÓN" : "ACADÉMICO";
    const imageUrl = IMAGES.ACADEMICO_2;

    const date = new Date(row.created_at);
    const day = date.getDate();
    const monthName = MONTHS[date.getMonth()] || "";
    const year = date.getFullYear();
    const fecha = `${day} ${monthName} ${year}`;

    return {
      id: row.id,
      titulo: row.titulo,
      contenido: row.contenido,
      destinatario: row.destinatario,
      fecha,
      tag,
      imageUrl,
    };
  });
}

export async function getComunicadosAlumno(): Promise<ComunicadoItem[]> {
  const supabase = await createSupabaseServerClient();

  const { data: dbData, error: dbError } = await supabase
    .from("comunicados")
    .select("id, titulo, contenido, destinatario, created_at")
    .eq("publicado", true)
    .or("destinatario.eq.alumno,destinatario.is.null")
    .order("created_at", { ascending: false });

  if (dbError) {
    console.error("Error fetching announcements from DB:", dbError);
    return [];
  }

  return mapComunicados((dbData || []) as ComunicadoRow[]);
}

export async function getComunicadosPadre(): Promise<ComunicadoItem[]> {
  const supabase = await createSupabaseServerClient();

  const { data: dbData, error: dbError } = await supabase
    .from("comunicados")
    .select("id, titulo, contenido, destinatario, created_at")
    .eq("publicado", true)
    .or("destinatario.eq.alumno,destinatario.eq.padre,destinatario.is.null")
    .order("created_at", { ascending: false });

  if (dbError) {
    console.error("Error fetching announcements for padres from DB:", dbError);
    return [];
  }

  return mapComunicados((dbData || []) as ComunicadoRow[]);
}

export async function getComunicadosAdmin(): Promise<ComunicadoItem[]> {
  const supabase = await createSupabaseServerClient();

  const { data: dbData, error: dbError } = await supabase
    .from("comunicados")
    .select("id, titulo, contenido, destinatario, created_at")
    .order("created_at", { ascending: false });

  if (dbError) {
    console.error("Error fetching admin announcements from DB:", dbError);
    return [];
  }

  return mapComunicados((dbData || []) as ComunicadoRow[]);
}

export async function getComunicadosAdminFiltered(filters: AdminComunicadosFilters): Promise<ComunicadoItem[]> {
  const supabase = await createSupabaseServerClient();
  const titulo = filters.titulo?.trim() ?? "";
  const destinatario = filters.destinatario?.trim() ?? "todos";

  let query = supabase
    .from("comunicados")
    .select("id, titulo, contenido, destinatario, created_at")
    .order("created_at", { ascending: false });

  if (titulo) {
    query = query.ilike("titulo", `%${titulo}%`);
  }

  if (destinatario && destinatario !== "todos") {
    query = query.eq("destinatario", destinatario);
  }

  const { data: dbData, error: dbError } = await query;

  if (dbError) {
    console.error("Error fetching admin announcements from DB:", dbError);
    return [];
  }

  return mapComunicados((dbData || []) as ComunicadoRow[]);
}

