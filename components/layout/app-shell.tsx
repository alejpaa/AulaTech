import type { ReactNode } from "react";
import { roleNavigation } from "@/config/navigation";
import type { UserProfile } from "@/lib/auth/roles";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { MobileNav } from "./mobile-nav";
import { SidebarNav } from "./sidebar-nav";
import { Bell } from "lucide-react";
import Link from "next/link";

type AppShellProps = {
  profile: UserProfile;
  children: ReactNode;
};

export function AppShell({ profile, children }: AppShellProps) {
  const navigation = roleNavigation[profile.rol];

  // Extraer iniciales para el avatar
  const initials = `${profile.nombres?.[0] || ""}${profile.apellidos?.[0] || ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
        <Link href={`/${profile.rol}`} className="p-6 pb-2 block hover:bg-slate-50 transition-colors cursor-pointer">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">AULA-TECH</p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Portal Académico</h1>
          <Badge className="mt-3 bg-blue-50 text-blue-700 hover:bg-blue-100 border-0" variant="neutral">
            {profile.rol.toUpperCase()}
          </Badge>
        </Link>

        <div className="flex-1 overflow-y-auto px-6">
          <SidebarNav items={navigation} />
        </div>

        {/* Perfil Minimizado en Sidebar */}
        <div className="border-t border-slate-100 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-slate-900">
                {profile.nombres} {profile.apellidos}
              </p>
              <p className="truncate text-xs text-slate-500">{profile.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-72 w-full">
        {/* Header Global */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-5 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-4">
            {/* Opcionalmente dejar espacio para Mobile Menu Trigger aquí si se requiere */}
            <h2 className="hidden text-sm font-medium text-slate-500 sm:block">
              1 Bimestre 2026 - Año Escolar
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <Bell className="h-5 w-5" />
            </button>

            <div className="h-4 w-px bg-slate-200"></div>

            <LogoutButton />
          </div>
        </header>

        <MobileNav items={navigation} />

        <main className="flex-1 px-5 py-8 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
