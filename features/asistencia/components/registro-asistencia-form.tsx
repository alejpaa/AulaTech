"use client";

import { useState } from "react";
import type { AlumnoAsistencia } from "../services/profesor.server";
import { guardarAsistenciaMasiva, type AsistenciaGuardarInput } from "../actions";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, FileText, Loader2, Save } from "lucide-react";

type Props = {
  alumnos: AlumnoAsistencia[];
  cursoId: string;
  bimestreId: string;
  fecha: string;
};

type EstadoAsistencia = "presente" | "tarde" | "falta" | "justificado" | null;

export function RegistroAsistenciaForm({ alumnos, cursoId, bimestreId, fecha }: Props) {
  const [attendance, setAttendance] = useState<Record<string, EstadoAsistencia>>(() => {
    const initialState: Record<string, EstadoAsistencia> = {};
    alumnos.forEach(a => {
      initialState[a.alumno_id] = a.estado;
    });
    return initialState;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleStateChange = (alumnoId: string, newState: EstadoAsistencia) => {
    setAttendance(prev => {
      // Si hace click en el mismo estado, lo deselecciona
      if (prev[alumnoId] === newState) {
        const copy = { ...prev };
        copy[alumnoId] = null;
        return copy;
      }
      return { ...prev, [alumnoId]: newState };
    });
    setMessage(null);
  };

  const handleClearAll = () => {
    setAttendance({});
    setMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    // Preparar payload
    const registros: AsistenciaGuardarInput[] = [];
    Object.keys(attendance).forEach(alumnoId => {
      const estado = attendance[alumnoId];
      if (estado) {
        registros.push({
          alumno_id: alumnoId,
          curso_id: cursoId,
          bimestre_id: bimestreId,
          semana: 1, // Hardcoded para cumplir con la DB
          fecha,
          estado
        });
      }
    });

    if (registros.length === 0) {
      setMessage({ text: "No hay asistencia seleccionada para guardar.", type: 'error' });
      setIsSaving(false);
      return;
    }

    const result = await guardarAsistenciaMasiva(registros);
    if (result.success) {
      setMessage({ text: "Asistencia guardada correctamente.", type: 'success' });
    } else {
      setMessage({ text: result.error || "Error desconocido", type: 'error' });
    }
    
    setIsSaving(false);
  };

  const OptionButton = ({ alumnoId, state, icon: Icon, label, colorClass, activeClass }: any) => {
    const isActive = attendance[alumnoId] === state;
    return (
      <button
        onClick={() => handleStateChange(alumnoId, state)}
        title={label}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isActive ? activeClass : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-16 text-center font-semibold text-slate-600">Nº</TableHead>
                <TableHead className="font-semibold text-slate-600">Apellidos y Nombres</TableHead>
                <TableHead className="text-center font-semibold text-slate-600">Presente</TableHead>
                <TableHead className="text-center font-semibold text-slate-600">Tarde</TableHead>
                <TableHead className="text-center font-semibold text-slate-600">Falta</TableHead>
                <TableHead className="text-center font-semibold text-slate-600">Justif.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alumnos.map((alumno, index) => (
                <TableRow key={alumno.alumno_id} className="hover:bg-slate-50/50">
                  <TableCell className="text-center text-slate-500">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{alumno.apellidos}</span>
                      <span className="text-sm text-slate-500">{alumno.nombres}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <OptionButton 
                        alumnoId={alumno.alumno_id} state="presente" icon={Check} 
                        label="Presente" activeClass="bg-green-500 shadow-md shadow-green-200" 
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <OptionButton 
                        alumnoId={alumno.alumno_id} state="tarde" icon={Clock} 
                        label="Tardanza" activeClass="bg-orange-500 shadow-md shadow-orange-200" 
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <OptionButton 
                        alumnoId={alumno.alumno_id} state="falta" icon={X} 
                        label="Falta" activeClass="bg-red-500 shadow-md shadow-red-200" 
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <OptionButton 
                        alumnoId={alumno.alumno_id} state="justificado" icon={FileText} 
                        label="Justificado" activeClass="bg-blue-500 shadow-md shadow-blue-200" 
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="text-sm font-medium">
          {message ? (
            <span className={message.type === 'success' ? 'text-green-600' : 'text-red-600'}>
              {message.text}
            </span>
          ) : (
            <span className="text-slate-500">Asegúrate de marcar a todos los alumnos antes de guardar.</span>
          )}
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <Button 
            variant="outline"
            onClick={handleClearAll} 
            disabled={isSaving}
            className="w-full sm:w-auto bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
          >
            Limpiar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white min-w-[160px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Guardar Registro
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
