import { createSupabaseServerClient } from "@/lib/supabase/server";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export async function getDashboardProfesor(usuarioId: string) {
  const supabase = await createSupabaseServerClient();

  // 1. Obtener profesor_id
  const { data: profesorData, error: profesorError } = await supabase
    .from("profesores")
    .select("id")
    .eq("usuario_id", usuarioId)
    .single();

  if (profesorError || !profesorData) {
    console.error("Error fetching profesor:", profesorError);
    return {
      assignedCoursesCount: 0,
      assignedStudentsCount: 0,
      latestAnnouncement: null,
    };
  }

  const profesorId = profesorData.id;

  // 2. Obtener cursos asignados (únicos) y salones asignados
  const { data: cursosProfesorData } = await supabase
    .from("cursos_profesor")
    .select("curso_id, salon_id")
    .eq("profesor_id", profesorId);

  let assignedCoursesCount = 0;
  let assignedStudentsCount = 0;

  if (cursosProfesorData && cursosProfesorData.length > 0) {
    const uniqueCourses = new Set(cursosProfesorData.map(cp => cp.curso_id));
    assignedCoursesCount = uniqueCourses.size;

    const assignedSalones = Array.from(new Set(cursosProfesorData.map(cp => cp.salon_id)));

    // 3. Obtener alumnos únicos en esos salones
    if (assignedSalones.length > 0) {
      const { data: alumnosData } = await supabase
        .from("alumnos")
        .select("id")
        .in("salon_id", assignedSalones);
      
      if (alumnosData) {
        // En teoría, como seleccionamos id, todos son únicos, pero garantizamos:
        assignedStudentsCount = new Set(alumnosData.map(a => a.id)).size;
      }
    }
  }

  // 4. Obtener último comunicado
  const { data: comunicadoData } = await supabase
    .from("comunicados")
    .select("titulo, contenido, created_at, destinatario")
    .eq("publicado", true)
    .or(`destinatario.eq.profesor,destinatario.is.null`)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  let latestAnnouncement = null;
  if (comunicadoData) {
    const date = new Date(comunicadoData.created_at);
    latestAnnouncement = {
      title: comunicadoData.titulo,
      date: `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
      tag: "INSTITUCIONAL", 
      excerpt: comunicadoData.contenido,
    };
  }

  return {
    assignedCoursesCount,
    assignedStudentsCount,
    latestAnnouncement,
  };
}
