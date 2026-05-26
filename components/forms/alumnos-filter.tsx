"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";

type Seccion = {
  id: string;
  seccion: string;
  nombre: string;
};

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

export function AlumnosFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [apellidos, setApellidos] = useState<string>("");
  const [nombres, setNombres] = useState<string>("");
  const [dni, setDni] = useState<string>("");
  const [nivel, setNivel] = useState<string>("");
  const [grado, setGrado] = useState<string>("");
  const [seccion, setSeccion] = useState<string>("");
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [loadingSecciones, setLoadingSecciones] = useState(false);

  // Inicializar valores desde URL
  useEffect(() => {
    setApellidos(searchParams.get("apellidos") ?? "");
    setNombres(searchParams.get("nombres") ?? "");
    setDni(searchParams.get("dni") ?? "");
    setNivel(searchParams.get("nivel") ?? "");
    setGrado(searchParams.get("grado") ?? "");
    setSeccion(searchParams.get("seccion") ?? "");
  }, [searchParams]);

  // Resetear grado y sección cuando cambia nivel
  useEffect(() => {
    setGrado("");
    setSeccion("");
    setSecciones([]);
  }, [nivel]);

  // Cargar secciones cuando cambian nivel y grado
  useEffect(() => {
    if (!nivel || !grado) {
      setSecciones([]);
      setSeccion("");
      return;
    }

    const fetchSecciones = async () => {
      setLoadingSecciones(true);
      try {
        const response = await fetch(`/api/salones/by-nivel-grado?nivel=${nivel}&grado=${grado}`);
        if (response.ok) {
          const data = await response.json();
          setSecciones(data);
          setSeccion("");
        }
      } catch (error) {
        console.error("Error fetching secciones:", error);
        setSecciones([]);
      } finally {
        setLoadingSecciones(false);
      }
    };

    fetchSecciones();
  }, [nivel, grado]);

  const gradosDisponibles =
    nivel === "primaria"
      ? GRADOS_PRIMARIA
      : nivel === "secundaria"
        ? GRADOS_SECUNDARIA
        : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (apellidos) params.set("apellidos", apellidos);
    if (nombres) params.set("nombres", nombres);
    if (dni) params.set("dni", dni);
    if (nivel) params.set("nivel", nivel);
    if (grado) params.set("grado", grado);
    if (seccion) params.set("seccion", seccion);

    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    setApellidos("");
    setNombres("");
    setDni("");
    setNivel("");
    setGrado("");
    setSeccion("");
    setSecciones([]);
    router.push("?");
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
        {/* Apellidos */}
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="filter-apellidos">Apellidos</Label>
          <Input
            id="filter-apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            placeholder="Buscar..."
          />
        </div>

        {/* Nombres */}
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="filter-nombres">Nombres</Label>
          <Input
            id="filter-nombres"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            placeholder="Buscar..."
          />
        </div>

        {/* DNI */}
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="filter-dni">DNI</Label>
          <Input
            id="filter-dni"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="Buscar..."
            maxLength={12}
          />
        </div>

        {/* Nivel */}
        <div className="space-y-2 sm:col-span-1">
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

        {/* Grado */}
        <div className="space-y-2 sm:col-span-1">
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
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="filter-seccion">Sección</Label>
          <select
            id="filter-seccion"
            value={seccion}
            onChange={(e) => setSeccion(e.target.value)}
            disabled={!grado || loadingSecciones || secciones.length === 0}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-500"
          >
            <option value="">
              {loadingSecciones ? "Cargando..." : secciones.length === 0 ? "Sin secciones" : "Todos"}
            </option>
            {secciones.map((s) => (
              <option key={s.id} value={s.seccion}>
                {s.seccion}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botones */}
      <div className="flex items-center gap-2">
        <Button type="submit" className="w-full sm:w-auto" variant="primary">
          Buscar
        </Button>
        <Button type="button" onClick={handleReset} variant="outline" title="Limpiar filtros">
          Limpiar
        </Button>
      </div>
    </form>
  );
}
