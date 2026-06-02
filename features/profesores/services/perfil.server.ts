import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ProfesorPerfil = {
  nombres: string;
  apellidos: string;
  especialidad: string | null;
  telefono: string | null;
};

export async function getPerfilProfesor(): Promise<ProfesorPerfil | null> {
  const supabase = await createSupabaseServerClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  // Obtener telefono de usuarios
  const { data: usuario } = await supabase
    .from("usuarios")
    .select("telefono")
    .eq("auth_user_id", userData.user.id)
    .single();

  // Obtener nombres, apellidos, especialidad de profesores
  // RLS ya filtra por current_usuario_id()
  const { data: profesor } = await supabase
    .from("profesores")
    .select("nombres, apellidos, especialidad")
    .single();

  if (!profesor) return null;

  return {
    nombres: profesor.nombres,
    apellidos: profesor.apellidos,
    especialidad: profesor.especialidad,
    telefono: usuario?.telefono || null,
  };
}
