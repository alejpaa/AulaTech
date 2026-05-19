import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/layout/empty-state";
import { FilterPanel } from "@/components/layout/filter-panel";
import { PageHeader } from "@/components/layout/page-header";

export default function AlumnoAsistenciaPage() {
  return (
    <>
      <PageHeader title="Mi asistencia" description="Consulta de asistencia por bimestre." />
      <FilterPanel>
        <div className="space-y-2"><Label>Bimestre</Label><Select><option>Seleccionar bimestre</option></Select></div>
        <div className="flex items-end"><Button className="w-full" variant="secondary">Consultar</Button></div>
      </FilterPanel>
      <EmptyState title="Sin asistencia para mostrar" description="Selecciona un bimestre para revisar tu asistencia." />
    </>
  );
}
