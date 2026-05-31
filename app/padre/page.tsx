import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { CheckCircle2, AlertTriangle, Calendar, Megaphone, ClipboardList, CreditCard } from "lucide-react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { PadreChildSelect } from "@/components/forms/padre-child-select";
import { getDashboardHijo, getHijosDelPadre } from "@/features/padres/services/padres.server";
import { EmptyState } from "@/components/layout/empty-state";

type PageProps = {
  searchParams: Promise<{ hijoId?: string }>;
};

export default async function PadrePage({ searchParams }: PageProps) {
  const profile = await requireRole(["padre"]);
  const params = await searchParams;

  const hijos = await getHijosDelPadre(profile.id);
  const selectedHijoId = params.hijoId ?? hijos[0]?.id ?? null;
  const selectedChild = hijos.find((hijo) => hijo.id === selectedHijoId) ?? hijos[0] ?? null;

  if (!selectedChild) {
    return (
      <div className="space-y-6">
        <PageHeader title="Panel padre" description="Accede a la información académica de tu hijo desde un solo lugar." />
        <EmptyState
          title="Aún no tienes hijos asignados"
          description="Contacta a la institución para vincular tu cuenta con el perfil de tu hijo."
        />
      </div>
    );
  }

  const summary = await getDashboardHijo(selectedChild.id);

  return (
    <div className="space-y-6">
      <PageHeader title="Panel padre" description="Revisa asistencia, notas, comunicados y pagos de tu hijo." />

      <PadreChildSelect hijos={hijos} selectedChildId={selectedChild.id} basePath="/padre" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Datos del hijo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-500">{selectedChild.nombres} {selectedChild.apellidos}</p>
            <p className="text-sm text-slate-500">{selectedChild.nivel ?? "Nivel no asignado"}</p>
            <p className="text-sm text-slate-500">{selectedChild.grado ?? "Grado no asignado"} {selectedChild.seccion ?? ""}</p>
            {selectedChild.codigo ? <p className="text-sm text-slate-500">Código: {selectedChild.codigo}</p> : null}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Rendimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Promedio global</p>
              <p className="text-lg font-semibold text-slate-900">
                {summary.globalAverage !== null ? summary.globalAverage.toFixed(1) : "--"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Asistencia total</p>
              <StatusBadge status={summary.attendancePercentage !== null ? `${summary.attendancePercentage}%` : "Sin datos"} variant={summary.attendancePercentage !== null && summary.attendancePercentage >= 90 ? "success" : summary.attendancePercentage !== null && summary.attendancePercentage >= 75 ? "warning" : "danger"} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Próximo pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.upcomingPayment ? (
              <>
                <p className="text-sm font-semibold text-slate-900">{summary.upcomingPayment.month}</p>
                <p className="text-3xl font-bold text-red-600">S/ {summary.upcomingPayment.amount.toFixed(2)}</p>
                <StatusBadge status={summary.upcomingPayment.status} variant="danger" />
              </>
            ) : (
              <p className="text-sm text-slate-500">No hay pagos pendientes.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm xl:col-span-2">
          <CardHeader>
            <CardTitle>Comunicado reciente</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.latestAnnouncement ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-900">
                  <Megaphone className="h-5 w-5 text-slate-500" />
                  <span className="text-sm font-semibold">{summary.latestAnnouncement.tag}</span>
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">{summary.latestAnnouncement.title}</p>
                  <p className="text-sm text-slate-500 mt-1">{summary.latestAnnouncement.date}</p>
                </div>
                <p className="text-sm text-slate-600 line-clamp-3">{summary.latestAnnouncement.excerpt}</p>
                <Link href="/padre/comunicados">
                  <Button variant="outline">Ver comunicados</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-500">No hay comunicados recientes para tu hijo.</p>
                <Link href="/padre/comunicados">
                  <Button variant="outline">Ver comunicados</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link href={`/padre/notas?hijoId=${selectedChild.id}`}>
              <Button variant="secondary" className="w-full justify-start gap-2">
                <ClipboardList className="h-4 w-4" /> Ver notas
              </Button>
            </Link>
            <Link href={`/padre/asistencia?hijoId=${selectedChild.id}`}>
              <Button variant="secondary" className="w-full justify-start gap-2">
                <Calendar className="h-4 w-4" /> Ver asistencia
              </Button>
            </Link>
            <Link href={`/padre/pagos?hijoId=${selectedChild.id}`}>
              <Button variant="secondary" className="w-full justify-start gap-2">
                <CreditCard className="h-4 w-4" /> Ver pagos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
