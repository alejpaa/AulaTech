import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const months = ["Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function AlumnoPagosPage() {
  return (
    <>
      <PageHeader title="Mis pagos" description="Estado visual mensual de tus pagos." />
      <Card>
        <CardHeader><CardTitle>Periodo actual</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {months.map((month) => (
            <div className="rounded-xl border border-slate-200 p-4" key={month}>
              <p className="font-medium text-slate-950">{month}</p>
              <Badge className="mt-2" variant="warning">Pendiente</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
