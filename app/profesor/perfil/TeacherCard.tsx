"use client";

import type { ProfesorPerfil } from "@/features/profesores/services/perfil.server";
import { Badge } from "@/components/ui/badge";
import { School, BookOpen, Phone } from "lucide-react";

type TeacherCardProps = {
  profile: ProfesorPerfil;
};

export function TeacherCard({ profile }: TeacherCardProps) {
  // Iniciales para el avatar
  const initials = `${profile.nombres?.[0] || ""}${profile.apellidos?.[0] || ""}`.toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-lg p-6 flex flex-col items-center justify-between min-h-[460px] border border-slate-800">
      {/* Elementos Decorativos de Fondo */}
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-30px] left-[-30px] w-36 h-36 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>

      {/* Cabecera de la Credencial */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <School className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 leading-none">
            AULA-TECH
          </span>
        </div>
        <Badge className="bg-indigo-500/25 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full hover:bg-indigo-500/25">
          DOCENTE
        </Badge>
      </div>

      {/* Avatar e Identidad Principal */}
      <div className="flex flex-col items-center text-center my-2">
        {/* Avatar Circular con Iniciales */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] border-2 border-white/20">
            {initials}
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-green-500 border-2 border-slate-900 flex items-center justify-center shadow">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
          </div>
        </div>

        {/* Nombres y Apellidos */}
        <h3 className="text-xl font-bold tracking-tight text-white line-clamp-1 px-2">
          {profile.nombres}
        </h3>
        <p className="text-sm font-semibold text-slate-300 mt-1 line-clamp-1 px-2">
          {profile.apellidos}
        </p>
      </div>

      {/* Cajas Inferiores de Métricas Clave */}
      <div className="w-full grid grid-cols-2 gap-4 mt-auto">
        {/* Especialidad */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col items-center justify-center text-center">
          <BookOpen className="w-4 h-4 text-indigo-400 mb-1" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Especialidad
          </span>
          <span className="text-sm font-extrabold mt-1 text-indigo-200 line-clamp-1">
            {profile.especialidad || "Sin definir"}
          </span>
        </div>

        {/* Contacto */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col items-center justify-center text-center">
          <Phone className="w-4 h-4 text-indigo-400 mb-1" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Contacto
          </span>
          <span className="text-sm font-extrabold text-indigo-200 mt-1 line-clamp-1">
            {profile.telefono || "No registrado"}
          </span>
        </div>
      </div>

      {/* Pie de la Credencial */}
      <div className="w-full text-center border-t border-white/5 pt-3 mt-6">
        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-[0.25em]">
          Credencial Docente Autorizada
        </p>
      </div>
    </div>
  );
}
