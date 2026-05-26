"use client";

import type { ComunicadoItem } from "@/features/comunicados/services/comunicados.server";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, Users } from "lucide-react";

type ComunicadoCardProps = {
  comunicado: ComunicadoItem;
  onRead: (item: ComunicadoItem) => void;
};

export function ComunicadoCard({ comunicado, onRead }: ComunicadoCardProps) {
  const destinatarioLabel = comunicado.destinatario === "profesor"
    ? "Profesores"
    : comunicado.destinatario === "alumno"
      ? "Alumnos"
      : comunicado.destinatario === "administrativo"
        ? "Administrativo"
        : "Todos";

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200 w-full group">
      {/* Mitad Superior: Imagen con Zoom Effect y Badge Flotante */}
      <div className="relative h-44 w-full overflow-hidden shrink-0">
        <img
          src={comunicado.imageUrl}
          alt={comunicado.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />
        {/* Capa sutil de oscurecimiento de fondo */}
        <div className="absolute inset-0 bg-slate-950/10 pointer-events-none group-hover:bg-slate-950/5 transition-colors"></div>

        {/* Badge Flotante Superior Izquierdo */}
        <div className="absolute top-4 left-4">
          <StatusBadge
            status={comunicado.tag}
            variant={comunicado.tag === "REUNIÓN" ? "warning" : "info"}
          />
        </div>
      </div>

      {/* Mitad Inferior: Datos, Título, Extracto */}
      <CardContent className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          {/* Fecha */}
          <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 leading-none">
            <Calendar className="w-3.5 h-3.5" />
            {comunicado.fecha}
          </p>

          <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 leading-none">
            <Users className="w-3.5 h-3.5" />
            {destinatarioLabel}
          </p>

          {/* Título en Negrita */}
          <h3 className="text-base font-extrabold text-slate-900 leading-snug tracking-tight group-hover:text-blue-600 transition-colors line-clamp-2">
            {comunicado.titulo}
          </h3>

          {/* Extracto de Contenido */}
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
            {comunicado.contenido}
          </p>
        </div>

        {/* Botón de Acción Leer Más */}
        <div className="pt-2 border-t border-slate-50">
          <Button
            onClick={() => onRead(comunicado)}
            className="w-full bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-100 hover:border-blue-100 flex items-center justify-center gap-1 text-xs font-semibold py-2 rounded-xl transition-all"
            variant="ghost"
          >
            Leer más
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
