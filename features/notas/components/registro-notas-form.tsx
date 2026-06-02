"use client";

import { useState } from "react";
import type { AlumnoNota } from "../services/profesor.server";
import { guardarNotasMasivas, type NotaGuardarInput } from "../actions";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";

type Props = {
  alumnos: AlumnoNota[];
  cursoId: string;
  bimestreId: string;
};

type NotasState = {
  nota_mensual: number | null;
  nota_bimestral: number | null;
};

export function RegistroNotasForm({ alumnos, cursoId, bimestreId }: Props) {
  const [notas, setNotas] = useState<Record<string, NotasState>>(() => {
    const initialState: Record<string, NotasState> = {};
    alumnos.forEach(a => {
      initialState[a.alumno_id] = {
        nota_mensual: a.nota_mensual,
        nota_bimestral: a.nota_bimestral,
      };
    });
    return initialState;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleNotaChange = (alumnoId: string, field: keyof NotasState, value: string) => {
    // Permitir vacío
    if (value === "") {
      setNotas(prev => ({ ...prev, [alumnoId]: { ...prev[alumnoId], [field]: null } }));
      return;
    }

    const num = parseFloat(value);
    // Validar rango numérico (0 a 20)
    if (!isNaN(num) && num >= 0 && num <= 20) {
      setNotas(prev => ({ ...prev, [alumnoId]: { ...prev[alumnoId], [field]: num } }));
    }
    setMessage(null);
  };

  const calcularPromedioVisual = (n: NotasState) => {
    if (n.nota_mensual !== null && n.nota_bimestral !== null) {
      return ((n.nota_mensual + n.nota_bimestral) / 2).toFixed(1);
    }
    return "--";
  };

  const getPromedioColor = (n: NotasState) => {
    if (n.nota_mensual !== null && n.nota_bimestral !== null) {
      const p = (n.nota_mensual + n.nota_bimestral) / 2;
      if (p >= 11) return "bg-green-100 text-green-700 border-green-200";
      if (p >= 10) return "bg-orange-100 text-orange-700 border-orange-200";
      return "bg-red-100 text-red-700 border-red-200";
    }
    return "bg-slate-100 text-slate-500 border-slate-200";
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    const registros: NotaGuardarInput[] = [];
    Object.keys(notas).forEach(alumnoId => {
      const state = notas[alumnoId];
      // Solo guardar si hay al menos una nota ingresada, o si se quiere limpiar?
      // Upsert requiere ambas, si se guardan nulas tmb es valido
      registros.push({
        alumno_id: alumnoId,
        curso_id: cursoId,
        bimestre_id: bimestreId,
        nota_mensual: state.nota_mensual,
        nota_bimestral: state.nota_bimestral,
      });
    });

    const result = await guardarNotasMasivas(registros);
    if (result.success) {
      setMessage({ text: "Notas guardadas correctamente.", type: 'success' });
    } else {
      setMessage({ text: result.error || "Error desconocido", type: 'error' });
    }
    
    setIsSaving(false);
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
                <TableHead className="text-center font-semibold text-slate-600 w-32">N. Mensual</TableHead>
                <TableHead className="text-center font-semibold text-slate-600 w-32">N. Bimestral</TableHead>
                <TableHead className="text-center font-semibold text-slate-600 w-32">Promedio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alumnos.map((alumno, index) => {
                const state = notas[alumno.alumno_id] || { nota_mensual: null, nota_bimestral: null };
                return (
                  <TableRow key={alumno.alumno_id} className="hover:bg-slate-50/50">
                    <TableCell className="text-center text-slate-500">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{alumno.apellidos}</span>
                        <span className="text-sm text-slate-500">{alumno.nombres}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        min="0" max="20" step="0.1"
                        value={state.nota_mensual !== null ? state.nota_mensual : ""}
                        onChange={(e) => handleNotaChange(alumno.alumno_id, "nota_mensual", e.target.value)}
                        className="text-center bg-white font-medium"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        min="0" max="20" step="0.1"
                        value={state.nota_bimestral !== null ? state.nota_bimestral : ""}
                        onChange={(e) => handleNotaChange(alumno.alumno_id, "nota_bimestral", e.target.value)}
                        className="text-center bg-white font-medium"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-sm font-bold border ${getPromedioColor(state)}`}>
                        {calcularPromedioVisual(state)}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
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
            <span className="text-slate-500">Recuerda que las notas son sobre 20.</span>
          )}
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Guardar Notas
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
