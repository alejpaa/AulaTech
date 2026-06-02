"use client";

import { useState, useMemo } from "react";
import type { AlumnoAsignado } from "../services/profesor.server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/custom-select";
import { Search, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";

type Props = {
  alumnos: AlumnoAsignado[];
};

export function AlumnosProfesorTable({ alumnos }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSalon, setSelectedSalon] = useState("");

  // Extraer salones únicos de la lista de alumnos
  const salonesUnicos = useMemo(() => {
    const salones = new Set<string>();
    alumnos.forEach((a) => {
      if (a.salon) {
        salones.add(`${a.salon.grado} - ${a.salon.seccion}`);
      }
    });
    return Array.from(salones).sort();
  }, [alumnos]);

  const filteredAlumnos = alumnos.filter((alumno) => {
    // Filtro por búsqueda de texto
    const term = searchTerm.toLowerCase();
    const fullName = `${alumno.apellidos} ${alumno.nombres}`.toLowerCase();
    const codigo = (alumno.codigo || "").toLowerCase();
    const matchesSearch = fullName.includes(term) || codigo.includes(term);

    // Filtro por salón
    const salonString = alumno.salon ? `${alumno.salon.grado} - ${alumno.salon.seccion}` : "";
    const matchesSalon = selectedSalon ? salonString === selectedSalon : true;
    
    return matchesSearch && matchesSalon;
  });

  return (
    <div className="space-y-4">
      {/* Buscador y Filtro */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar por apellidos, nombres o código..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-full sm:w-64 z-10">
          <CustomSelect
            value={selectedSalon}
            onChange={(val) => setSelectedSalon(val)}
            placeholder="Todos los salones"
            options={[
              { value: "", label: "Todos los salones" },
              ...salonesUnicos.map(s => ({ value: s, label: s }))
            ]}
          />
        </div>
      </div>

      {/* Tabla */}
      <Card className="border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-slate-600">Código</TableHead>
                <TableHead className="font-semibold text-slate-600">Apellidos y Nombres</TableHead>
                <TableHead className="font-semibold text-slate-600">DNI</TableHead>
                <TableHead className="font-semibold text-slate-600 text-right">Salón</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlumnos.length > 0 ? (
                filteredAlumnos.map((alumno) => (
                  <TableRow key={alumno.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-600">
                      {alumno.codigo || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{alumno.apellidos}</span>
                        <span className="text-sm text-slate-500">{alumno.nombres}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {alumno.dni || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {alumno.salon ? (
                        <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {alumno.salon.grado} - {alumno.salon.seccion}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                    {alumnos.length === 0
                      ? "No tienes alumnos asignados a tu cargo."
                      : "No se encontraron alumnos que coincidan con la búsqueda."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {/* Resumen footer */}
      <div className="text-xs text-slate-500 text-right px-2">
        Mostrando {filteredAlumnos.length} de {alumnos.length} alumnos asignados.
      </div>
    </div>
  );
}
