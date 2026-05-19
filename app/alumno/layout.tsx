import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/auth/session";

export default async function AlumnoLayout({ children }: { children: ReactNode }) {
  const profile = await requireRole(["alumno"]);

  return <AppShell profile={profile}>{children}</AppShell>;
}
