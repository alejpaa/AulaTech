import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { roleHomePath } from "@/lib/auth/roles";

export default async function HomePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  redirect(roleHomePath(profile.rol));
}
