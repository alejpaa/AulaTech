"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type PerfilUpdateInput = {
  nombres: string;
  apellidos: string;
  especialidad: string;
  telefono: string;
};

export async function actualizarPerfilProfesor(data: PerfilUpdateInput) {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { success: false, error: "No autorizado" };

  const { data: usuarioData } = await supabase
    .from("usuarios")
    .select("id")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (!usuarioData) return { success: false, error: "Usuario no encontrado" };
  const usuario_id = usuarioData.id;

  // Actualizar tabla usuarios (telefono, nombres, apellidos por consistencia)
  const { error: errorUsuario } = await supabase
    .from("usuarios")
    .update({ 
      nombres: data.nombres, 
      apellidos: data.apellidos, 
      telefono: data.telefono 
    })
    .eq("id", usuario_id);

  if (errorUsuario) {
    return { success: false, error: "Error al actualizar datos de contacto." };
  }

  // Actualizar tabla profesores (nombres, apellidos, especialidad)
  const { error: errorProfesor } = await supabase
    .from("profesores")
    .update({ 
      nombres: data.nombres, 
      apellidos: data.apellidos, 
      especialidad: data.especialidad 
    })
    .eq("usuario_id", usuario_id);

  if (errorProfesor) {
    return { success: false, error: "Error al actualizar perfil profesional." };
  }

  revalidatePath("/profesor/perfil");
  return { success: true };
}
