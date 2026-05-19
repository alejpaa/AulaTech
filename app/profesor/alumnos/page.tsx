import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/layout/empty-state";
import { FilterPanel } from "@/components/layout/filter-panel";
import { PageHeader } from "@/components/layout/page-header";

export default function ProfesorAlumnosPage() {
  return (
    <>
      <PageHeader title="Alumnos asignados" description="Consulta de alumnos de tus salones asignados en modo solo lectura." />
      <FilterPanel>
        <div className="space-y-2"><Label>Apellidos</Label><Input placeholder="Buscar alumno" /></div>
        <div className="space-y-2"><Label>Salon</Label><Input placeholder="Salon asignado" /></div>
        <div className="flex items-end"><Button className="w-full" variant="secondary">Buscar</Button></div>
      </FilterPanel>
      <EmptyState title="Sin alumnos asignados" description="Cuando tengas salones asignados, aqui veras el listado de alumnos." />
    </>
  );
}
