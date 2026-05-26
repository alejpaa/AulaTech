"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NotaItem } from "@/features/notas/services/notas.server";
import { AlertCircle, Award } from "lucide-react";

type NotasSummaryProps = {
  notas: NotaItem[];
};

export function NotasSummary({ notas }: NotasSummaryProps) {
  // Solo consideramos cursos con promedio para las estadísticas
  const notasCompletas = notas.filter((n) => n.promedio !== null);

  const aprobados = notasCompletas.filter((n) => n.promedio! >= 11);
  const enRiesgo = notasCompletas.filter((n) => n.promedio! < 11);

  const data = [
    { name: "Aprobados", value: aprobados.length, color: "#22c55e" }, // green-500
    { name: "En Riesgo", value: enRiesgo.length, color: "#ef4444" },  // red-500
  ].filter((d) => d.value > 0);

  // Encontrar el mejor curso
  const mejorCurso = notasCompletas.length > 0 
    ? [...notasCompletas].sort((a, b) => b.promedio! - a.promedio!)[0] 
    : null;

  return (
    <div className="space-y-6">
      {/* Gráfico de Dona */}
      <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-white pb-2 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
            Distribución de cursos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[200px] w-full">
            {notasCompletas.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value} cursos`, 'Cantidad']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">
                Sin datos suficientes
              </div>
            )}
          </div>
          
          {notasCompletas.length > 0 && (
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-slate-600">{aprobados.length} Aprobados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-slate-600">{enRiesgo.length} En riesgo</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cursos en Riesgo */}
      {enRiesgo.length > 0 && (
        <Card className="rounded-xl border-red-100 bg-red-50/50 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Requieren Atención
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {enRiesgo.map(curso => (
                <li key={curso.id} className="flex justify-between items-center text-sm">
                  <span className="text-red-700">{curso.curso}</span>
                  <span className="font-bold text-red-700">{curso.promedio?.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Mejor Rendimiento */}
      {mejorCurso && (
        <Card className="rounded-xl border-green-100 bg-green-50/50 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-green-800 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Mejor Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center text-sm">
              <span className="text-green-700 font-medium">{mejorCurso.curso}</span>
              <span className="font-bold text-green-700 text-lg">{mejorCurso.promedio?.toFixed(1)}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
