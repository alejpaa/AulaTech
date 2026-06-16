"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export type PadreChildOption = {
  id: string;
  nombres: string;
  apellidos: string;
  grado: string | null;
  seccion: string | null;
  nivel: string | null;
};

type PadreChildSelectProps = {
  hijos: PadreChildOption[];
  selectedChildId: string | null;
  basePath: string;
};

export function PadreChildSelect({ hijos, selectedChildId, basePath }: PadreChildSelectProps) {
  const router = useRouter();
  const [value, setValue] = useState(selectedChildId || "");

  if (hijos.length === 0) {
    return null;
  }

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextId = event.target.value;
    setValue(nextId);
    router.push(`${basePath}?hijoId=${nextId}`);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Label htmlFor="hijo-select">Selecciona a tu hijo</Label>
          <Select id="hijo-select" value={value} onChange={handleChange}>
            {hijos.map((hijo) => (
              <option key={hijo.id} value={hijo.id}>
                {hijo.nombres} {hijo.apellidos}
                {hijo.grado ? ` • ${hijo.nivel || ""} ${hijo.grado}${hijo.seccion ? ` ${hijo.seccion}` : ""}` : ""}
              </option>
            ))}
          </Select>
        </div>
        <div className="sm:text-right">
          <p className="text-sm text-slate-500">Hijo asignado</p>
          <p className="text-base font-semibold text-slate-900">{hijos.length} {hijos.length === 1 ? "niño" : "niños"}</p>
        </div>
      </div>
      <div className="mt-4 text-sm text-slate-500">
        Elige un hijo para consultar su asistencia, notas y pagos desde tu panel.
      </div>
    </div>
  );
}
