import { requireRole } from "@/lib/auth/session";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { getHijosDelPadre, getPagosHijo } from "@/features/padres/services/padres.server";
import { PadreChildSelect } from "@/components/forms/padre-child-select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, CreditCard, Calendar } from "lucide-react";

function formatFechaPago(fechaStr: string | null) {
  if (!fechaStr) return "";
  const [year, month, day] = fechaStr.split("-");
  return `${day}/${month}/${year}`;
}

type PageProps = {
  searchParams: Promise<{ hijoId?: string }>;
};

export default async function PadrePagosPage({ searchParams }: PageProps) {
  const profile = await requireRole(["padre"]);
  const params = await searchParams;

  const hijos = await getHijosDelPadre(profile.id);
  const selectedChildId = params.hijoId ?? hijos[0]?.id ?? null;
  const selectedChild = hijos.find((hijo) => hijo.id === selectedChildId) ?? hijos[0] ?? null;

  if (!selectedChild) {
    return (
      <div className="space-y-6">
        <PageHeader title="Pagos del hijo" description="Revisa los pagos y saldos pendientes de tu hijo." />
        <EmptyState
          title="No hay hijos vinculados"
          description="Contacta al colegio para asociar un estudiante a tu cuenta de padre."
        />
      </div>
    );
  }

  const { pagos, summary } = await getPagosHijo(selectedChild.id);

  return (
    <div className="space-y-6">
      <PageHeader title="Pagos del hijo" description={`Estado de pagos para ${selectedChild.nombres} ${selectedChild.apellidos}.`} />
      <PadreChildSelect hijos={hijos} selectedChildId={selectedChild.id} basePath="/padre/pagos" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase leading-none">Pagados</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{summary.totalPagados} meses</p>
          </div>
        </Card>

        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase leading-none">Pendientes</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{summary.totalPendientes} meses</p>
          </div>
        </Card>

        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase leading-none">Deuda pendiente</p>
            <p className="text-2xl font-bold text-red-600 mt-1">S/ {summary.montoPendiente.toFixed(2)}</p>
          </div>
        </Card>

        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase leading-none">Próx. límite</p>
            <p className="text-sm font-bold text-slate-800 mt-2 truncate">{summary.proximoVencimiento || "Al día"}</p>
          </div>
        </Card>
      </div>

      <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <CardHeader className="bg-white pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Detalle de pagos</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {pagos.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-sm text-slate-400">
              No se encontraron registros de pagos para este alumno.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {pagos.map((pago) => {
                const isPaid = pago.estado === "pagado";
                return (
                  <div
                    className={`rounded-2xl border p-5 flex flex-col justify-between min-h-[170px] transition-all hover:shadow-md ${isPaid ? "border-slate-100 bg-slate-50/30" : "border-red-100 bg-red-50/10 shadow-sm"}`}
                    key={pago.id}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-lg font-bold text-slate-900">{pago.mesNombre}</p>
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">Año {pago.anio}</p>
                        </div>
                        <StatusBadge status={isPaid ? "Pagado" : "Pendiente"} variant={isPaid ? "success" : "danger"} />
                      </div>
                      <p className={`text-2xl font-extrabold mt-4 tracking-tight ${isPaid ? "text-slate-700" : "text-red-600"}`}>S/ {pago.monto.toFixed(2)}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[10px]">
                      {isPaid ? (
                        <p className="text-slate-500">Cancelado el: <span className="font-semibold text-slate-700">{formatFechaPago(pago.fechaPago)}</span></p>
                      ) : (
                        <p className="text-red-500 font-semibold flex items-center gap-1">Requiere regularización</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
