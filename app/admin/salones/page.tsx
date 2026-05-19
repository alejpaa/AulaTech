import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSalonesPage() {
  return (
    <>
      <PageHeader title="Salones" description="Registro y edicion de grados, secciones y niveles." />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <EmptyState title="Sin salones registrados" description="Registra salones para organizar alumnos, cursos y profesores." />
        <Card>
          <CardHeader>
            <CardTitle>Nuevo salon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Nombre</Label><Input placeholder="1ro A Primaria" /></div>
            <div className="space-y-2"><Label>Grado</Label><Input placeholder="1ro" /></div>
            <div className="space-y-2"><Label>Seccion</Label><Input placeholder="A" /></div>
            <Button className="w-full">Guardar salon</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
