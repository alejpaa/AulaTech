import { PageHeader } from "@/components/layout/page-header";
import { ModuleGrid } from "@/components/layout/module-grid";
import { getDashboardProfesor } from "@/features/profesores/services/dashboard.server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Users, BookOpen, Megaphone, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { roleNavigation } from "@/config/navigation";

export default async function ProfesorPage() {
  const profile = await requireRole(["profesor"]);
  const data = await getDashboardProfesor(profile.id);

  // Filtrar el dashboard de los accesos rápidos
  const quickAccessItems = roleNavigation.profesor.filter(item => item.href !== "/profesor");

  return (
    <div className="space-y-8">
      <PageHeader title="Panel Profesor" description="Resumen de tu carga académica y comunicados recientes." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Métricas Principales (2/3 de la pantalla en desktop) */}
        <Card className="md:col-span-2 flex flex-col p-8 border-slate-100 shadow-sm min-h-[300px]">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">
            Métricas de tu Carga Académica
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
            {/* Métrica 1: Cursos */}
            <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10" />
              </div>
              <span className="text-5xl font-extrabold text-slate-800 tracking-tighter mb-2">
                {data.assignedCoursesCount}
              </span>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Cursos Asignados
              </span>
            </div>

            {/* Métrica 2: Alumnos */}
            <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Users className="w-10 h-10" />
              </div>
              <span className="text-5xl font-extrabold text-slate-800 tracking-tighter mb-2">
                {data.assignedStudentsCount}
              </span>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Alumnos Totales
              </span>
            </div>
          </div>
        </Card>

        {/* Último Comunicado (1/3 de la pantalla) */}
        <div className="flex flex-col">
          <Card className={`border-slate-100 shadow-sm flex flex-col h-full ${data.latestAnnouncement ? 'border-l-4 border-l-blue-400' : ''}`}>
            <CardHeader className="pb-2">
              {data.latestAnnouncement ? (
                <div className="flex justify-between items-center mb-2">
                  <StatusBadge status={data.latestAnnouncement.tag} variant="info" />
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {data.latestAnnouncement.date}
                  </span>
                </div>
              ) : (
                <CardTitle className="text-sm text-slate-500 font-medium flex items-center gap-2">
                  <Megaphone className="w-4 h-4" />
                  Comunicados
                </CardTitle>
              )}
              {data.latestAnnouncement && (
                <CardTitle className="text-base font-bold text-slate-800 leading-tight">
                  {data.latestAnnouncement.title}
                </CardTitle>
              )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {data.latestAnnouncement ? (
                <>
                  <p className="text-sm text-slate-600 mb-6 line-clamp-4">
                    {data.latestAnnouncement.excerpt}
                  </p>
                  <Link href="/profesor/comunicados" className="w-full block mt-auto">
                    <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
                      Leer más
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                  <FileText className="w-12 h-12 text-slate-200 mb-4" />
                  <p className="text-sm text-slate-500">No hay comunicados recientes.</p>
                  <Link href="/profesor/comunicados" className="w-full block mt-6">
                    <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
                      Ir a comunicados
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Accesos Rápidos (ModuleGrid) */}
      <div className="pt-4">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Accesos Rápidos</h3>
        <ModuleGrid items={quickAccessItems} />
      </div>
    </div>
  );
}
