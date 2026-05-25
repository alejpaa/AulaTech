"use client";

import type { ComunicadoItem } from "@/features/comunicados/services/comunicados.server";
import { X, Calendar } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";

type ComunicadoModalProps = {
  comunicado: ComunicadoItem | null;
  isOpen: boolean;
  onClose: () => void;
};

export function ComunicadoModal({ comunicado, isOpen, onClose }: ComunicadoModalProps) {
  if (!isOpen || !comunicado) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Portada del Comunicado */}
        <div className="relative h-48 w-full shrink-0">
          <img
            src={comunicado.imageUrl}
            alt={comunicado.titulo}
            className="w-full h-full object-cover"
          />
          {/* Sombra de superposición para mejorar contraste del botón cerrar */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none"></div>

          {/* Botón de Cerrar Flotante */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-2 bg-white/20 hover:bg-white/35 backdrop-blur text-white transition-all border border-white/10"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge Flotante sobre Portada */}
          <div className="absolute bottom-4 left-4">
            <StatusBadge
              status={comunicado.tag}
              variant={comunicado.tag === "REUNIÓN" ? "warning" : "info"}
            />
          </div>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {/* Fecha */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold leading-none">
            <Calendar className="w-3.5 h-3.5" />
            {comunicado.fecha}
          </div>

          {/* Título */}
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {comunicado.titulo}
          </h3>

          {/* Contenido (con soporte para saltos de línea) */}
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
            {comunicado.contenido}
          </p>
        </div>

        {/* Botón de Cierre Inferior */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
          <Button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium min-w-[100px]"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
