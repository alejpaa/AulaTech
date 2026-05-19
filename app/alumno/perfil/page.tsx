import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AlumnoPerfilPage() {
  return (
    <>
      <PageHeader title="Mi perfil" description="Informacion personal en modo consulta." />
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Datos personales</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Nombres</Label><Input disabled placeholder="Nombres" /></div>
          <div className="space-y-2"><Label>Apellidos</Label><Input disabled placeholder="Apellidos" /></div>
          <div className="space-y-2"><Label>DNI</Label><Input disabled placeholder="DNI" /></div>
          <div className="space-y-2"><Label>Salon</Label><Input disabled placeholder="Salon" /></div>
        </CardContent>
      </Card>
    </>
  );
}
