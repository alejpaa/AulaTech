import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/layout/empty-state";
import { FilterPanel } from "@/components/layout/filter-panel";
import { PageHeader } from "@/components/layout/page-header";

export default function AdminAlumnosPage() {
  return (
    <>
      <PageHeader title="Alumnos" description="Busqueda, listado, registro, edicion y desactivacion de alumnos." actions={<Button>Registrar alumno</Button>} />
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
          <Label>Grado</Label>
          <Select defaultValue="">
            <option value="">Todos</option>
            <option>1ro</option>
            <option>2do</option>
            <option>3ro</option>
          </Select>
        </div>
        <div className="flex items-end">
          <Button className="w-full" variant="secondary">Buscar</Button>
        </div>
      </FilterPanel>
      <EmptyState title="Sin alumnos para mostrar" description="Usa los filtros para buscar alumnos o registra uno nuevo." />
    </>
  );
}
