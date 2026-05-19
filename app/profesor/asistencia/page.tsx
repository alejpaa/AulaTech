import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/layout/empty-state";
import { FilterPanel } from "@/components/layout/filter-panel";
import { PageHeader } from "@/components/layout/page-header";

export default function ProfesorAsistenciaPage() {
  return (
    <>
      <PageHeader title="Asistencia" description="Consulta y registro de asistencia por bimestre y semana." />
      <FilterPanel>
        <div className="space-y-2"><Label>Curso</Label><Select><option>Seleccionar curso</option></Select></div>
        <div className="space-y-2"><Label>Bimestre</Label><Select><option>Seleccionar bimestre</option></Select></div>
        <div className="space-y-2"><Label>Semana</Label><Select><option>Seleccionar semana</option></Select></div>
        <div className="flex items-end"><Button className="w-full" variant="secondary">Abrir registro</Button></div>
      </FilterPanel>
      <EmptyState title="Selecciona curso y semana" description="Luego se mostrara la lista de alumnos para marcar presente, tarde, falta o justificado." />
    </>
  );
}
