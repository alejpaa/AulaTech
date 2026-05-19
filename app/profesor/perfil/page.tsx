import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfesorPerfilPage() {
  return (
    <>
      <PageHeader title="Perfil" description="Informacion personal del profesor." />
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Datos personales</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Nombres</Label><Input placeholder="Nombres" /></div>
          <div className="space-y-2"><Label>Apellidos</Label><Input placeholder="Apellidos" /></div>
          <div className="space-y-2"><Label>Telefono</Label><Input placeholder="Telefono" /></div>
          <div className="space-y-2"><Label>Especialidad</Label><Input placeholder="Especialidad" /></div>
          <div className="sm:col-span-2"><Button>Guardar cambios</Button></div>
        </CardContent>
      </Card>
    </>
  );
}
