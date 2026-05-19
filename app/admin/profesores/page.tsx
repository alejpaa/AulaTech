import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/layout/empty-state";
import { FilterPanel } from "@/components/layout/filter-panel";
import { PageHeader } from "@/components/layout/page-header";

export default function AdminProfesoresPage() {
  return (
    <>
      <PageHeader title="Profesores" description="Gestion docente, busqueda por filtros y asignacion academica." actions={<Button>Registrar profesor</Button>} />
      <FilterPanel>
        <div className="space-y-2">
          <Label>Apellidos</Label>
          <Input placeholder="Buscar por apellidos" />
        </div>
        <div className="space-y-2">
          <Label>Nombres</Label>
          <Input placeholder="Buscar por nombres" />
        </div>
        <div className="space-y-2">
          <Label>Especialidad</Label>
          <Input placeholder="Matematica, Comunicacion..." />
        </div>
        <div className="flex items-end">
          <Button className="w-full" variant="secondary">Buscar</Button>
        </div>
      </FilterPanel>
      <EmptyState title="Sin profesores para mostrar" description="Usa los filtros para buscar profesores o registra uno nuevo." />
    </>
  );
}
