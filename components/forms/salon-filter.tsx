"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";

const NIVELES = [
  { value: "", label: "Todos los niveles" },
  { value: "primaria", label: "Primaria" },
  { value: "secundaria", label: "Secundaria" },
];

const GRADOS_PRIMARIA = [
  { value: "1ro", label: "1ro" },
  { value: "2do", label: "2do" },
  { value: "3ro", label: "3ro" },
  { value: "4to", label: "4to" },
  { value: "5to", label: "5to" },
  { value: "6to", label: "6to" },
];

const GRADOS_SECUNDARIA = [
  { value: "1ro", label: "1ro" },
  { value: "2do", label: "2do" },
  { value: "3ro", label: "3ro" },
  { value: "4to", label: "4to" },
  { value: "5to", label: "5to" },
];

export function SalonFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [nivel, setNivel] = useState<string>("");
  const [grado, setGrado] = useState<string>("");
  const [seccion, setSeccion] = useState<string>("");

  // Inicializar valores desde URL
  useEffect(() => {
    setNivel(searchParams.get("nivel") ?? "");
    setGrado(searchParams.get("grado") ?? "");
    setSeccion(searchParams.get("seccion") ?? "");
  }, [searchParams]);

  // Resetear grado cuando cambia nivel
  useEffect(() => {
    setGrado("");
  }, [nivel]);

  const gradosDisponibles =
    nivel === "primaria"
      ? GRADOS_PRIMARIA
      : nivel === "secundaria"
        ? GRADOS_SECUNDARIA
        : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (nivel) params.set("nivel", nivel);
    if (grado) params.set("grado", grado);
    if (seccion) params.set("seccion", seccion);

    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    setNivel("");
    setGrado("");
    setSeccion("");
    router.push("?");
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {/* Nivel */}
        <div className="space-y-2">
          <Label htmlFor="filter-nivel">Nivel</Label>
          <select
            id="filter-nivel"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {NIVELES.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grado - solo se muestra si hay nivel seleccionado */}
        <div className="space-y-2">
          <Label htmlFor="filter-grado">Grado</Label>
          <select
            id="filter-grado"
            value={grado}
            onChange={(e) => setGrado(e.target.value)}
            disabled={!nivel}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-500"
          >
            <option value="">Todos los grados</option>
            {gradosDisponibles.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sección */}
        <div className="space-y-2">
          <Label htmlFor="filter-seccion">Sección</Label>
          <Input
            id="filter-seccion"
            value={seccion}
            onChange={(e) => setSeccion(e.target.value.toUpperCase())}
            placeholder="A, B, C..."
            maxLength={1}
            className="uppercase"
          />
        </div>

        {/* Botones */}
        <div className="flex items-end gap-2">
          <Button type="submit" className="w-full" variant="primary">
            Buscar
          </Button>
          <Button type="button" onClick={handleReset} variant="outline" title="Limpiar filtros">
            Limpiar
          </Button>
        </div>
      </div>
    </form>
  );
}
