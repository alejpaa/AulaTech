import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/layout/empty-state";
import { FilterPanel } from "@/components/layout/filter-panel";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminComunicadosPage() {
  return (
    <>
      <PageHeader title="Comunicados" description="Lista, redacta y publica comunicados institucionales por rol." />
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <section>
          <FilterPanel>
            <div className="space-y-2">
              <Label>Buscar</Label>
              <Input placeholder="Titulo o contenido" />
            </div>
            <div className="space-y-2">
              <Label>Destinatario</Label>
              <Select defaultValue="todos">
                <option value="todos">Todos</option>
                <option value="profesor">Profesores</option>
                <option value="alumno">Alumnos</option>
              </Select>
            </div>
          </FilterPanel>
          <EmptyState title="Sin comunicados cargados" description="Aqui apareceran los comunicados publicados y los borradores disponibles." />
        </section>
        <Card>
          <CardHeader>
            <CardTitle>Nuevo comunicado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Titulo</Label>
              <Input placeholder="Ej. Reunion de padres" />
            </div>
            <div className="space-y-2">
              <Label>Destinatario</Label>
              <Select defaultValue="">
                <option value="">Todos</option>
                <option value="profesor">Profesores</option>
                <option value="alumno">Alumnos</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Contenido</Label>
              <Textarea placeholder="Redacta el comunicado" />
            </div>
            <Button className="w-full">Publicar</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
