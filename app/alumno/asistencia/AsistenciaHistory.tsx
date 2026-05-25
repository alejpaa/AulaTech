"use client";

import type { AsistenciaItem, AsistenciaEstado } from "@/features/asistencia/services/asistencia.server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

type AsistenciaHistoryProps = {
  asistencias: AsistenciaItem[];
};

export function AsistenciaHistory({ asistencias }: AsistenciaHistoryProps) {
  // Función para formatear fechas a español descriptivo
  const formatFecha = (fechaStr: string) => {
    try {
      const [year, month, day] = fechaStr.split("-");
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
      const formatted = date.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch {
      return fechaStr;
    }
  };

  // Mapeo de estados a estilos visuales
  const estadoConfig: Record<
    AsistenciaEstado,
    {
      dotColor: string;
      bgColor: string;
      textColor: string;
      label: string;
      motivo: string;
    }
  > = {
    presente: {
      dotColor: "bg-green-500",
      bgColor: "bg-green-50 text-green-700",
      textColor: "text-green-600 font-bold",
      label: "PRESENTE",
      motivo: "Asistencia a tiempo",
    },
    tarde: {
      dotColor: "bg-orange-500",
      bgColor: "bg-orange-50 text-orange-700",
      textColor: "text-orange-600 font-bold",
      label: "TARDANZA",
      motivo: "Ingreso con tardanza",
    },
    falta: {
      dotColor: "bg-red-500",
      bgColor: "bg-red-50 text-red-700",
      textColor: "text-red-600 font-bold",
      label: "FALTA",
      motivo: "Inasistencia injustificada",
    },
    justificado: {
      dotColor: "bg-blue-500",
      bgColor: "bg-blue-50 text-blue-700",
      textColor: "text-blue-600 font-bold",
      label: "JUSTIFICADO",
      motivo: "Inasistencia justificada",
    },
  };

  return (
    <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col w-full">
      <CardHeader className="bg-white pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
          Historial de asistencia
        </CardTitle>
        <span className="text-xs text-slate-400 font-medium bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1">
          {asistencias.length} registros
        </span>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-y-auto max-h-[500px]">
        {asistencias.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <p className="text-slate-400 font-medium text-sm">
              No se encontraron registros de asistencia en este bimestre.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {asistencias.map((item) => {
              const cfg = estadoConfig[item.estado] || estadoConfig.presente;

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 hover:bg-slate-50/50 transition-colors gap-3"
                >
                  <div className="flex items-start gap-3">
                    {/* Punto indicador de color */}
                    <div className={cn("w-2.5 h-2.5 rounded-full mt-1.5 shrink-0", cfg.dotColor)}></div>
                    <div>
                      {/* Fecha formateada */}
                      <p className="text-sm font-semibold text-slate-900 leading-none sm:leading-normal">
                        {formatFecha(item.fecha)}
                      </p>
                      {/* Curso y motivo de asistencia */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-slate-500">
                        <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.curso}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span>{cfg.motivo}</span>
                        <span className="text-slate-400">•</span>
                        <span>Semana {item.semana}</span>
                      </div>
                    </div>
                  </div>

                  {/* Estado en Texto Fuerte Alineado a la Derecha */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:text-right shrink-0">
                    <span className={cn("text-xs px-2.5 py-1 rounded-full font-bold", cfg.bgColor)}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
