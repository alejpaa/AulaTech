"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { actualizarPerfilProfesor } from "../actions";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { ProfesorPerfil } from "../services/perfil.server";

export function PerfilForm({ initialData }: { initialData: ProfesorPerfil | null }) {
  const [formData, setFormData] = useState({
    nombres: initialData?.nombres || "",
    apellidos: initialData?.apellidos || "",
    telefono: initialData?.telefono || "",
    especialidad: initialData?.especialidad || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const result = await actualizarPerfilProfesor(formData);
    
    if (result.success) {
      setMessage({ text: "Perfil actualizado correctamente.", type: "success" });
    } else {
      setMessage({ text: result.error || "Error al actualizar perfil.", type: "error" });
    }
    
    setIsSaving(false);
  };

  return (
    <Card className="w-full border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <CardTitle className="text-xl text-slate-800">Datos personales</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-slate-700">Nombres</Label>
            <Input 
              required
              value={formData.nombres} 
              onChange={e => setFormData(p => ({ ...p, nombres: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-700">Apellidos</Label>
            <Input 
              required
              value={formData.apellidos} 
              onChange={e => setFormData(p => ({ ...p, apellidos: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-700">Teléfono</Label>
            <Input 
              value={formData.telefono} 
              onChange={e => setFormData(p => ({ ...p, telefono: e.target.value }))}
              placeholder="Ej: 999888777"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-700">Especialidad</Label>
            <Input 
              value={formData.especialidad} 
              onChange={e => setFormData(p => ({ ...p, especialidad: e.target.value }))}
              placeholder="Ej: Matemática"
            />
          </div>
          
          <div className="sm:col-span-2 pt-4 flex flex-col sm:flex-row items-center gap-4 justify-between border-t border-slate-100">
            <div className="text-sm font-medium">
              {message && (
                <span className={`flex items-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {message.type === 'success' && <CheckCircle2 className="w-4 h-4 mr-1" />}
                  {message.text}
                </span>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={isSaving} 
              className="w-full sm:w-auto min-w-[150px] bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Guardando...</> : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
