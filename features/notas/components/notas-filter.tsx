"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/ui/custom-select";
import { Button } from "@/components/ui/button";
import { FilterPanel } from "@/components/layout/filter-panel";
import { Filter } from "lucide-react";
import type { FiltroCurso, FiltroBimestre } from "@/features/asistencia/services/profesor.server";

type Props = {
  cursos: FiltroCurso[];
  bimestres: FiltroBimestre[];
};

export function NotasFilter({ cursos, bimestres }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [curso, setCurso] = useState(searchParams.get("curso") || "");
  const [bimestre, setBimestre] = useState(searchParams.get("bimestre") || "");

  useEffect(() => {
    setCurso(searchParams.get("curso") || "");
    setBimestre(searchParams.get("bimestre") || "");
  }, [searchParams]);

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (curso) params.set("curso", curso);
    if (bimestre) params.set("bimestre", bimestre);
    router.push(`?${params.toString()}`);
  };

  return (
    <FilterPanel>
      <div className="space-y-2 z-40">
        <Label>Curso y Salón</Label>
        <CustomSelect 
          value={curso} 
          onChange={setCurso}
          placeholder="Seleccionar curso..."
          options={[
            { value: "", label: "Seleccionar curso..." },
            ...cursos.map((c) => ({
              value: `${c.curso_id}|${c.salon_id}`,
              label: c.nombre
            }))
          ]}
        />
      </div>

      <div className="space-y-2 z-30">
        <Label>Bimestre</Label>
        <CustomSelect 
          value={bimestre} 
          onChange={setBimestre}
          placeholder="Seleccionar bimestre..."
          options={[
            { value: "", label: "Seleccionar bimestre..." },
            ...bimestres.map((b) => ({
              value: b.id,
              label: b.nombre
            }))
          ]}
        />
      </div>

      <div className="sm:col-span-2 flex justify-end mt-2 self-end">
        <Button onClick={handleFilter} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800">
          <Filter className="w-4 h-4 mr-2" />
          Filtrar
        </Button>
      </div>
    </FilterPanel>
  );
}
