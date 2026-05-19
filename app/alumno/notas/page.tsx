import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/layout/empty-state";
import { FilterPanel } from "@/components/layout/filter-panel";
import { PageHeader } from "@/components/layout/page-header";

export default function AlumnoNotasPage() {
  return (
    <>
      <PageHeader title="Mis notas" description="Consulta de notas por curso y bimestre con promedio final." actions={<Button variant="outline">Exportar reporte</Button>} />
      <FilterPanel>
        <div className="space-y-2"><Label>Curso</Label><Select><option>Todos los cursos</option></Select></div>
        <div className="space-y-2"><Label>Bimestre</Label><Select><option>Todos los bimestres</option></Select></div>
        <div className="flex items-end"><Button className="w-full" variant="secondary">Consultar</Button></div>
      </FilterPanel>
      <EmptyState title="Sin notas para mostrar" description="Cuando existan registros, aqui veras tus notas por curso y bimestre." />
    </>
  );
}
