"use client";

import type { StudentProfileData } from "@/features/alumnos/services/perfil.server";
import { Badge } from "@/components/ui/badge";
import { Award, CalendarCheck, School } from "lucide-react";

type StudentCardProps = {
  profile: StudentProfileData;
};

export function StudentCard({ profile }: StudentCardProps) {
  // Iniciales para el avatar
  const initials = `${profile.nombres?.[0] || ""}${profile.apellidos?.[0] || ""}`.toUpperCase();

  const getPromedioColor = (promedio: number | null) => {
    if (promedio === null) return "text-slate-400";
    if (promedio < 10) return "text-red-400";
    if (promedio >= 11) return "text-green-400";
    return "text-orange-400";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white shadow-lg p-6 flex flex-col items-center justify-between min-h-[460px] border border-slate-800">
      {/* Elemento Decorativo de Fondo */}
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-30px] left-[-30px] w-36 h-36 rounded-full bg-sky-500/10 blur-2xl pointer-events-none"></div>

      {/* Cabecera de la Credencial */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <School className="w-5 h-5 text-sky-400" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 leading-none">
            AULA-TECH
          </span>
        </div>
        <Badge className="bg-sky-500/25 text-sky-300 border border-sky-500/20 px-2 py-0.5 rounded-full hover:bg-sky-500/25">
          ESTUDIANTE
        </Badge>
      </div>

      {/* Avatar e Identidad Principal */}
      <div className="flex flex-col items-center text-center my-2">
        {/* Avatar Circular con Iniciales */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-[0_0_15px_rgba(14,165,233,0.3)] border-2 border-white/20">
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

        {/* Código Institucional */}
        <span className="mt-3 inline-block rounded-md bg-white/5 border border-white/10 px-3 py-1 text-xs font-mono font-bold tracking-wider text-sky-300">
          Cód: {profile.codigo}
        </span>
      </div>

      {/* Salón y Grado/Sección */}
      <div className="w-full flex justify-center gap-2 my-4 flex-wrap">
        {profile.salon ? (
          <>
            <Badge className="bg-white/5 text-slate-300 border border-white/10 hover:bg-white/5">
              {profile.salon.grado}
            </Badge>
            <Badge className="bg-white/5 text-slate-300 border border-white/10 hover:bg-white/5">
              Sección "{profile.salon.seccion}"
            </Badge>
            <Badge className="bg-white/5 text-slate-300 border border-white/10 hover:bg-white/5">
              {profile.salon.nivel}
            </Badge>
          </>
        ) : (
          <Badge className="bg-white/5 text-slate-300 border border-white/10">
            Sin sección
          </Badge>
        )}
      </div>

      {/* Cajas Inferiores de Métricas Clave (Promedio y Asistencia) */}
      <div className="w-full grid grid-cols-2 gap-4 mt-2">
        {/* Promedio Global */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col items-center justify-center text-center">
          <Award className="w-4 h-4 text-sky-400 mb-1" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Promedio
          </span>
          <span className={`text-lg font-extrabold mt-0.5 ${getPromedioColor(profile.stats.promedioGlobal)}`}>
            {profile.stats.promedioGlobal !== null ? profile.stats.promedioGlobal.toFixed(1) : "—"}
          </span>
        </div>

        {/* Asistencia */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col items-center justify-center text-center">
          <CalendarCheck className="w-4 h-4 text-sky-400 mb-1" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Asistencia
          </span>
          <span className="text-lg font-extrabold text-sky-400 mt-0.5">
            {profile.stats.porcentajeAsistencia !== null ? `${profile.stats.porcentajeAsistencia}%` : "—"}
          </span>
        </div>
      </div>

      {/* Pie de la Credencial */}
      <div className="w-full text-center border-t border-white/5 pt-3 mt-4">
        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-[0.25em]">
          Credencial Escolar Autorizada
        </p>
      </div>
    </div>
  );
}
