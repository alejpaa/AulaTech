import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ComunicadoItem = {
  id: string;
  titulo: string;
  contenido: string;
  fecha: string;
  tag: "REUNIÓN" | "ACADÉMICO";
  imageUrl: string;
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

export async function getComunicadosAlumno(): Promise<ComunicadoItem[]> {
  const supabase = await createSupabaseServerClient();

  // 1. Consultar comunicados publicados dirigidos a alumnos o globales (destinatario is null)
  const { data: dbData, error: dbError } = await supabase
    .from("comunicados")
    .select("id, titulo, contenido, created_at")
    .eq("publicado", true)
    .or("destinatario.eq.alumno,destinatario.is.null")
    .order("created_at", { ascending: false });

  if (dbError) {
    console.error("Error fetching announcements from DB:", dbError);
    return [];
  }

  const rawComunicados = dbData || [];

  // 2. Mapear, categorizar y asignar portadas visuales
  return rawComunicados.map((row: any, index: number) => {
    const textToAnalyze = `${row.titulo} ${row.contenido}`.toLowerCase();

    // Categorización inteligente por palabras clave
    const isMeeting =
      textToAnalyze.includes("reunión") ||
      textToAnalyze.includes("reunion") ||
      textToAnalyze.includes("citación") ||
      textToAnalyze.includes("citacion") ||
      textToAnalyze.includes("padres") ||
      textToAnalyze.includes("asamblea") ||
      textToAnalyze.includes("convocatoria");

    const tag = isMeeting ? "REUNIÓN" : "ACADÉMICO";

    // Usar la imagen de los libros para todos los comunicados por consistencia visual
    const imageUrl = IMAGES.ACADEMICO_2;

    // Formateo de fecha
    const date = new Date(row.created_at);
    const day = date.getDate();
    const monthName = MONTHS[date.getMonth()] || "";
    const year = date.getFullYear();
    const fecha = `${day} ${monthName} ${year}`;

    return {
      id: row.id,
      titulo: row.titulo,
      contenido: row.contenido,
      fecha,
      tag,
      imageUrl,
    };
  });
}
export type { getDashboardAlumno } from "@/features/alumnos/services/dashboard.server";
