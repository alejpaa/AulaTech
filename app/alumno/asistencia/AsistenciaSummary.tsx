"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AsistenciaStats, MonthlyAsistenciaStat } from "@/features/asistencia/services/asistencia.server";
import { CalendarCheck, AlertTriangle, Clock, CheckCircle } from "lucide-react";

type AsistenciaSummaryProps = {
  stats: AsistenciaStats;
  monthlyStats: MonthlyAsistenciaStat[];
};

export function AsistenciaSummary({ stats, monthlyStats }: AsistenciaSummaryProps) {
  // Datos para el gráfico de dona
  const totalAsistencias = stats.presente + stats.tarde;
  const totalInasistencias = stats.falta + stats.justificado;

  const pieData = [
    { name: "Asistencia", value: totalAsistencias, color: "#0ea5e9" }, // Celeste Aula Tech (sky-500)
    { name: "Inasistencias", value: totalInasistencias, color: "#ef4444" }, // Rojo Peligro (red-500)
  ].filter((d) => d.value > 0);

  // Si no hay datos, mostramos un estado por defecto
  const hasData = stats.total > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Gráfico Dona de Asistencia */}
      <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <CardHeader className="bg-white pb-2 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
            Resumen de asistencia
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 flex-1 flex flex-col justify-between">
          <div className="relative h-[200px] w-full flex items-center justify-center">
            {hasData ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [`${value} días`, 'Cantidad']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Texto Central */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                  <span className="text-4xl font-extrabold text-slate-800 tracking-tight">
                    {stats.porcentajeAsistencia}%
                  </span>
                  <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase mt-0.5">
                    Asistencia
                  </span>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">
                Sin datos suficientes
              </div>
            )}
          </div>

          {hasData && (
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-500 flex-shrink-0"></div>
                <div>
                  <p className="text-xs text-slate-400 font-medium leading-none">Asistencias</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">{totalAsistencias} días</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0"></div>
                <div>
                  <p className="text-xs text-slate-400 font-medium leading-none">Inasistencias</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">{totalInasistencias} días</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Barras Mensuales */}
      <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <CardHeader className="bg-white pb-2 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
            Inasistencias por mes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 flex-1 flex flex-col justify-between">
          <div className="h-[200px] w-full">
            {monthlyStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyStats} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    formatter={(value: any) => [`${value} faltas`, 'Faltas']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="inasistencias" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">
                Sin inasistencias en este periodo
              </div>
            )}
          </div>

          {hasData && (
            <div className="grid grid-cols-4 gap-2 border-t border-slate-100 pt-4 mt-2 text-center">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase leading-none">P</p>
                <p className="text-sm font-bold text-green-600 mt-1 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {stats.presente}
                </p>
                <span className="text-[9px] text-slate-500 font-medium">Presentes</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase leading-none">T</p>
                <p className="text-sm font-bold text-orange-500 mt-1 flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {stats.tarde}
                </p>
                <span className="text-[9px] text-slate-500 font-medium">Tardes</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase leading-none">F</p>
                <p className="text-sm font-bold text-red-600 mt-1 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {stats.falta}
                </p>
                <span className="text-[9px] text-slate-500 font-medium">Faltas</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase leading-none">J</p>
                <p className="text-sm font-bold text-blue-600 mt-1 flex items-center justify-center gap-1">
                  <CalendarCheck className="w-3.5 h-3.5" />
                  {stats.justificado}
                </p>
                <span className="text-[9px] text-slate-500 font-medium">Justif.</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
