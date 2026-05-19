import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/layout/empty-state";
import { FilterPanel } from "@/components/layout/filter-panel";
import { PageHeader } from "@/components/layout/page-header";

export default function ProfesorNotasPage() {
  return (
    <>
      <PageHeader title="Registro de notas" description="Consulta, registra y actualiza notas de tus cursos asignados." />
      <FilterPanel>
        <div className="space-y-2"><Label>Salon</Label><Select><option>Seleccionar salon</option></Select></div>
        <div className="space-y-2"><Label>Curso</Label><Select><option>Seleccionar curso</option></Select></div>
        <div className="space-y-2"><Label>Bimestre</Label><Select><option>Seleccionar bimestre</option></Select></div>
        <div className="flex items-end"><Button className="w-full" variant="secondary">Cargar alumnos</Button></div>
      </FilterPanel>
      <EmptyState title="Selecciona filtros para registrar notas" description="Elige salon, curso y bimestre para cargar la lista de alumnos." />
    </>
  );
}
