"use client";

import type { StudentProfileData } from "@/features/alumnos/services/perfil.server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Calendar, ShieldAlert } from "lucide-react";

type StudentInfoProps = {
  profile: StudentProfileData;
};

export function StudentInfo({ profile }: StudentInfoProps) {
  // Formatear fecha de nacimiento
  const formatBirthDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    try {
      const [year, month, day] = dateStr.split("-");
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* CARD 1: Datos Personales */}
      <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <CardHeader className="bg-white pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            Datos Personales del Estudiante
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* DNI */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                  Documento de Identidad (DNI)
                </p>
                <p className="text-sm font-semibold text-slate-800 mt-1.5">{profile.dni}</p>
              </div>
            </div>

            {/* Correo Institucional */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                  Correo Institucional
                </p>
                <p className="text-sm font-semibold text-slate-800 mt-1.5 break-all">{profile.email}</p>
              </div>
            </div>

            {/* Teléfono */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                  Teléfono de Contacto
                </p>
                <p className="text-sm font-semibold text-slate-800 mt-1.5">{profile.telefono}</p>
              </div>
            </div>

            {/* Fecha de Nacimiento */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                  Fecha de Nacimiento
                </p>
                <p className="text-sm font-semibold text-slate-800 mt-1.5">
                  {formatBirthDate(profile.fechaNacimiento)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
