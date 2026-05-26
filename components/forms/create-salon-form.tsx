"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateSalonFormProps = {
  children?: ReactNode;
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

export function CreateSalonForm() {
  const [nivel, setNivel] = useState<string>("");
  const [grado, setGrado] = useState<string>("");
  const [seccion, setSeccion] = useState<string>("");
  const [nombre, setNombre] = useState<string>("");

  // Actualizar el nombre automáticamente cuando cambien nivel, grado o sección
  useEffect(() => {
    if (grado && seccion && nivel) {
      const gradoLabel = grado.charAt(0).toUpperCase() + grado.slice(1);
      const nivelLabel = nivel.charAt(0).toUpperCase() + nivel.slice(1);
      const newNombre = `${gradoLabel} ${seccion.toUpperCase()} ${nivelLabel}`;
      setNombre(newNombre);
    } else {
      setNombre("");
    }
  }, [grado, seccion, nivel]);

  // Resetear grado cuando cambia el nivel
  useEffect(() => {
    setGrado("");
  }, [nivel]);

  const gradosDisponibles =
    nivel === "primaria" ? GRADOS_PRIMARIA : nivel === "secundaria" ? GRADOS_SECUNDARIA : [];

  return (
    <>
      {/* Nivel */}
      <div className="space-y-2">
        <Label htmlFor="nivel-form">Nivel *</Label>
        <select
          id="nivel-form"
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

      {/* Grado - solo se muestra si hay nivel seleccionado */}
      {nivel && (
        <div className="space-y-2">
          <Label htmlFor="grado-form">Grado *</Label>
          <select
            id="grado-form"
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
      <div className="space-y-2">
        <Label htmlFor="seccion-form">Sección *</Label>
        <Input
          id="seccion-form"
          name="seccion"
          placeholder="Ej: A, B, C"
          value={seccion}
          onChange={(e) => setSeccion(e.target.value.toUpperCase())}
          maxLength={1}
          required
        />
      </div>

      {/* Nombre generado automáticamente (campo oculto) */}
      <input type="hidden" name="nombre" value={nombre} />

      {/* Vista previa del nombre */}
      {nombre && (
        <div className="space-y-2">
          <Label>Nombre del Salón</Label>
          <div className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900">
            {nombre}
          </div>
        </div>
      )}
    </>
  );
}
