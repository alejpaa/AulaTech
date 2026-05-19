import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppRole, UserProfile } from "./roles";
import { roleHomePath } from "./roles";

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("usuarios")
    .select("id, auth_user_id, rol, nombres, apellidos, email, activo")
    .eq("auth_user_id", user.id)
    .eq("activo", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as UserProfile;
}

export async function requireUserProfile() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  return profile;
}

export async function requireRole(allowedRoles: AppRole[]) {
  const profile = await requireUserProfile();

  if (!allowedRoles.includes(profile.rol)) {
    redirect(roleHomePath(profile.rol));
  }

  return profile;
}
