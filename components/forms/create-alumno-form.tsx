"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Seccion = {
  id: string;
  seccion: string;
  nombre: string;
};

const NIVELES = [
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

export function CreateAlumnoForm() {
  const [nombres, setNombres] = useState<string>("");
  const [apellidos, setApellidos] = useState<string>("");
  const [dni, setDni] = useState<string>("");
  const [fechaNacimiento, setFechaNacimiento] = useState<string>("");
  const [nivel, setNivel] = useState<string>("");
  const [grado, setGrado] = useState<string>("");
  const [salonId, setSalonId] = useState<string>("");
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [loadingSecciones, setLoadingSecciones] = useState(false);

  // Resetear grado cuando cambia nivel
  useEffect(() => {
    setGrado("");
    setSalonId("");
    setSecciones([]);
  }, [nivel]);

  // Cargar secciones cuando cambian nivel y grado
  useEffect(() => {
    if (!nivel || !grado) {
      setSecciones([]);
      setSalonId("");
      return;
    }

    const fetchSecciones = async () => {
      setLoadingSecciones(true);
      try {
        const response = await fetch(`/api/salones/by-nivel-grado?nivel=${nivel}&grado=${grado}`);
        if (response.ok) {
          const data = await response.json();
          setSecciones(data);
          setSalonId("");
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
    nivel === "primaria" ? GRADOS_PRIMARIA : nivel === "secundaria" ? GRADOS_SECUNDARIA : [];

  return (
    <>
      {/* Nombres */}
      <div className="space-y-2">
        <Label htmlFor="alumno-nombres">Nombre(s) *</Label>
        <Input
          id="alumno-nombres"
          name="nombres"
          value={nombres}
          onChange={(e) => setNombres(e.target.value)}
          placeholder="Ej: Juan"
          required
        />
      </div>

      {/* Apellidos */}
      <div className="space-y-2">
        <Label htmlFor="alumno-apellidos">Apellido(s) *</Label>
        <Input
          id="alumno-apellidos"
          name="apellidos"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
          placeholder="Ej: Pérez García"
          required
        />
      </div>

      {/* DNI */}
      <div className="space-y-2">
        <Label htmlFor="alumno-dni">DNI</Label>
        <Input
          id="alumno-dni"
          name="dni"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          placeholder="Ej: 12345678"
          maxLength={12}
        />
      </div>

      {/* Fecha de nacimiento */}
      <div className="space-y-2">
        <Label htmlFor="alumno-fecha">Fecha de nacimiento</Label>
        <Input
          id="alumno-fecha"
          name="fecha_nacimiento"
          type="date"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
        />
      </div>

      {/* Nivel */}
      <div className="space-y-2">
        <Label htmlFor="alumno-nivel">Nivel *</Label>
        <select
          id="alumno-nivel"
          name="nivel"
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          required
        >
          <option value="">Selecciona un nivel</option>
          {NIVELES.map((n) => (
            <option key={n.value} value={n.value}>
              {n.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grado */}
      {nivel && (
        <div className="space-y-2">
          <Label htmlFor="alumno-grado">Grado *</Label>
          <select
            id="alumno-grado"
            name="grado"
            value={grado}
            onChange={(e) => setGrado(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            required
          >
            <option value="">Selecciona un grado</option>
            {gradosDisponibles.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sección */}
      {grado && (
        <div className="space-y-2">
          <Label htmlFor="alumno-salon">Sección *</Label>
          <select
            id="alumno-salon"
            name="salon_id"
            value={salonId}
            onChange={(e) => setSalonId(e.target.value)}
            disabled={loadingSecciones || secciones.length === 0}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-500"
            required
          >
            <option value="">
              {loadingSecciones ? "Cargando secciones..." : secciones.length === 0 ? "No hay secciones disponibles" : "Selecciona una sección"}
            </option>
            {secciones.map((seccion) => (
              <option key={seccion.id} value={seccion.id}>
                {seccion.seccion} - {seccion.nombre}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
}
