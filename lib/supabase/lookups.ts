import { getCurrentProfile } from "@/lib/auth/session";
import { createSupabaseServerClient } from "./server";

type SimpleRow = {
  id: string;
  nombre?: string | null;
  nombres?: string | null;
  apellidos?: string | null;
  codigo?: string | null;
  grado?: string | null;
  seccion?: string | null;
  nivel?: string | null;
  salon_id?: string | null;
  numero?: number | null;
};

export type ReferenceMaps = {
  alumnosById: Map<string, SimpleRow>;
  cursosById: Map<string, SimpleRow>;
  bimestresById: Map<string, SimpleRow>;
  salonesById: Map<string, SimpleRow>;
  profesoresById: Map<string, SimpleRow>;
};

export async function loadReferenceMaps(): Promise<ReferenceMaps> {
  const supabase = await createSupabaseServerClient();

  const [alumnosResult, cursosResult, bimestresResult, salonesResult, profesoresResult] = await Promise.all([
    supabase.from("alumnos").select("id, codigo, nombres, apellidos, salon_id"),
    supabase.from("cursos").select("id, nombre, codigo"),
    supabase.from("bimestres").select("id, nombre, numero"),
    supabase.from("salones").select("id, nombre, grado, seccion, nivel"),
    supabase.from("profesores").select("id, codigo, nombres, apellidos, especialidad"),
  ]);

  if (alumnosResult.error) throw new Error(alumnosResult.error.message);
  if (cursosResult.error) throw new Error(cursosResult.error.message);
  if (bimestresResult.error) throw new Error(bimestresResult.error.message);
  if (salonesResult.error) throw new Error(salonesResult.error.message);
  if (profesoresResult.error) throw new Error(profesoresResult.error.message);

  return {
    alumnosById: new Map((alumnosResult.data ?? []).map((row) => [row.id, row])),
    cursosById: new Map((cursosResult.data ?? []).map((row) => [row.id, row])),
    bimestresById: new Map((bimestresResult.data ?? []).map((row) => [row.id, row])),
    salonesById: new Map((salonesResult.data ?? []).map((row) => [row.id, row])),
    profesoresById: new Map((profesoresResult.data ?? []).map((row) => [row.id, row])),
  };
}

export async function getCurrentAlumnoRecord() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("alumnos")
    .select("id, codigo, nombres, apellidos, dni, salon_id, activo, usuario_id")
    .eq("usuario_id", profile.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as { id: string; codigo: string | null; nombres: string; apellidos: string; dni: string | null; salon_id: string | null; activo: boolean; usuario_id: string };
}

export async function getCurrentProfesorRecord() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profesores")
    .select("id, codigo, nombres, apellidos, dni, especialidad, activo, usuario_id")
    .eq("usuario_id", profile.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as { id: string; codigo: string | null; nombres: string; apellidos: string; dni: string | null; especialidad: string | null; activo: boolean; usuario_id: string };
}