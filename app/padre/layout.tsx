import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/auth/session";

export default async function PadreLayout({ children }: { children: ReactNode }) {
  const profile = await requireRole(["padre"]);
  return <AppShell profile={profile}>{children}</AppShell>;
}
