import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Comunicado = {
  id: string;
  titulo: string;
  contenido: string;
  destinatario: string | null;
  created_at: string;
};

export async function getComunicados() {
  const supabase = await createSupabaseServerClient();

  // RLS (comunicados_select_publicados_por_rol) automáticamente filtra 
  // los que son publicado=true y destinatario=null o destinatario='profesor'
  const { data, error } = await supabase
    .from("comunicados")
    .select("id, titulo, contenido, destinatario, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching comunicados:", error);
    return [];
  }

  return (data || []) as Comunicado[];
}
