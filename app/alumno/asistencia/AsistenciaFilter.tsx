"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { FilterPanel } from "@/components/layout/filter-panel";

type BimestreOption = {
  id: string;
  nombre: string;
  numero: number;
};

type AsistenciaFilterProps = {
  bimestres: BimestreOption[];
  selectedBimestreId: string | null;
};

export function AsistenciaFilter({ bimestres, selectedBimestreId }: AsistenciaFilterProps) {
  const router = useRouter();
  const [val, setVal] = useState(selectedBimestreId || "");

  const handleQuery = () => {
    if (val) {
      router.push(`/alumno/asistencia?bimestreId=${val}`);
    }
  };

  return (
    <FilterPanel>
      <div className="space-y-2">
        <Label htmlFor="bimestre-select">Bimestre académico</Label>
        <Select
          id="bimestre-select"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        >
          <option value="" disabled>Seleccionar bimestre</option>
          {bimestres.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nombre} (Bimestre {b.numero})
            </option>
          ))}
        </Select>
      </div>
      <div className="flex items-end">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
          variant="secondary"
          onClick={handleQuery}
          disabled={!val}
        >
          Consultar
        </Button>
      </div>
    </FilterPanel>
  );
}
