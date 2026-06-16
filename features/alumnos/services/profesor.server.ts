import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AlumnoAsignado = {
  id: string;
  codigo: string | null;
  nombres: string;
  apellidos: string;
  dni: string | null;
  salon: {
    grado: string;
    seccion: string;
  } | null;
};

export async function getAlumnosAsignadosProfesor(): Promise<AlumnoAsignado[]> {
  const supabase = await createSupabaseServerClient();

  // Debido a la política RLS 'alumnos_profesor_select_asignados', 
  // esta consulta solo devolverá los alumnos que pertenecen a los salones 
  // donde el profesor autenticado tiene cursos asignados.
  const { data, error } = await supabase
    .from("alumnos")
    .select(`
      id,
      codigo,
      nombres,
      apellidos,
      dni,
      salones!inner (
        grado,
        seccion
      )
    `)
    .eq("activo", true)
    .order("apellidos", { ascending: true })
    .order("nombres", { ascending: true });

  if (error) {
    console.error("Error fetching alumnos asignados:", error);
    return [];
  }

  // Transformar la respuesta para que encaje con nuestro tipo (salones viene como objeto/array)
  return (data || []).map((row: any) => ({
    id: row.id,
    codigo: row.codigo,
    nombres: row.nombres,
    apellidos: row.apellidos,
    dni: row.dni,
    salon: row.salones ? {
      grado: Array.isArray(row.salones) ? row.salones[0]?.grado : row.salones.grado,
      seccion: Array.isArray(row.salones) ? row.salones[0]?.seccion : row.salones.seccion,
    } : null,
  }));
}
