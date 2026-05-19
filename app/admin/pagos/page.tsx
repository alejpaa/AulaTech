import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/layout/empty-state";
import { FilterPanel } from "@/components/layout/filter-panel";
import { PageHeader } from "@/components/layout/page-header";

export default function AdminPagosPage() {
  return (
    <>
      <PageHeader title="Pagos" description="Busqueda por DNI y actualizacion del estado mensual de pagos." />
      <FilterPanel>
        <div className="space-y-2 sm:col-span-2">
          <Label>DNI del alumno</Label>
          <Input placeholder="Ingresa DNI" />
        </div>
        <div className="flex items-end">
          <Button className="w-full" variant="secondary">Buscar pagos</Button>
        </div>
      </FilterPanel>
      <EmptyState title="Busca un alumno para ver pagos" description="Ingresa el DNI para consultar y actualizar el estado mensual." />
    </>
  );
}
