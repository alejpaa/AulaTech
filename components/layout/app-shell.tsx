import type { ReactNode } from "react";
import { roleNavigation } from "@/config/navigation";
import type { UserProfile } from "@/lib/auth/roles";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { MobileNav } from "./mobile-nav";
import { SidebarNav } from "./sidebar-nav";

type AppShellProps = {
  profile: UserProfile;
  children: ReactNode;
};

export function AppShell({ profile, children }: AppShellProps) {
  const navigation = roleNavigation[profile.rol];

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-6 lg:block">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">AULA-TECH</p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Gestion escolar</h1>
          <Badge className="mt-3" variant="neutral">
            {profile.rol}
          </Badge>
        </div>

        <SidebarNav items={navigation} />
      </aside>

      <div className="lg:pl-72">
        <header className="border-b border-slate-200 bg-white px-5 py-4 lg:px-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Sesion activa</p>
              <p className="font-medium text-slate-950">
                {profile.nombres} {profile.apellidos}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="hidden text-sm text-slate-500 sm:block">{profile.email}</p>
              <LogoutButton />
            </div>
          </div>
        </header>
        <MobileNav items={navigation} />

        <main className="px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
