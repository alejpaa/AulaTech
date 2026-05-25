import { requireRole } from "@/lib/auth/session";
import { PageHeader } from "@/components/layout/page-header";
import { getMisPagos } from "@/features/pagos/services/pagos.server";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, CreditCard, Calendar } from "lucide-react";

export default async function AlumnoPagosPage() {
  const profile = await requireRole(["alumno"]);
  const { pagos, summary } = await getMisPagos(profile.id);

  const formatFechaPago = (fechaStr: string | null) => {
    if (!fechaStr) return "";
    const [year, month, day] = fechaStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis pagos"
        description="Revisa el estado de tus mensualidades escolares, pagos realizados y pendientes."
      />

      {/* Tarjetas KPI de Resumen Financiero */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Pagados */}
        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase leading-none">Pagados</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{summary.totalPagados} meses</p>
          </div>
        </Card>

        {/* Total Pendientes */}
        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase leading-none">Pendientes</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{summary.totalPendientes} meses</p>
          </div>
        </Card>

        {/* Monto Pendiente */}
        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase leading-none">Deuda Pendiente</p>
            <p className="text-2xl font-bold text-red-600 mt-1">S/ {summary.montoPendiente.toFixed(2)}</p>
          </div>
        </Card>

        {/* Próximo Vencimiento */}
        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase leading-none">Próx. Límite</p>
            <p className="text-sm font-bold text-slate-800 mt-2 truncate">
              {summary.proximoVencimiento || "Al día"}
            </p>
          </div>
        </Card>
      </div>

      {/* Grid de Meses */}
      <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <CardHeader className="bg-white pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
            Periodo Escolar Actual
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {pagos.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-sm text-slate-400">
              No se encontraron registros de pagos asignados.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {pagos.map((pago) => {
                const isPaid = pago.estado === "pagado";

                return (
                  <div
                    className={`rounded-2xl border p-5 flex flex-col justify-between min-h-[170px] transition-all hover:shadow-md ${isPaid
                        ? "border-slate-100 bg-slate-50/30"
                        : "border-red-100 bg-red-50/10 shadow-sm"
                      }`}
                    key={pago.id}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-lg font-bold text-slate-900 leading-tight">
                            {pago.mesNombre}
                          </p>
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">
                            Año {pago.anio}
                          </p>
                        </div>
                        <StatusBadge
                          status={isPaid ? "Pagado" : "Pendiente"}
                          variant={isPaid ? "success" : "danger"}
                        />
                      </div>

                      <p className={`text-2xl font-extrabold mt-4 tracking-tight ${isPaid ? "text-slate-700" : "text-red-600"
                        }`}>
                        S/ {pago.monto.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center">
                      {isPaid ? (
                        <p className="text-[10px] font-medium text-slate-400">
                          Cancelado el: <span className="font-semibold text-slate-600">{formatFechaPago(pago.fechaPago)}</span>
                        </p>
                      ) : (
                        <p className="text-[10px] font-semibold text-red-500 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          Requiere regularización
                        </p>
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
