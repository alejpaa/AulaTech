import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/layout/empty-state";
import { FilterPanel } from "@/components/layout/filter-panel";
import { PageHeader } from "@/components/layout/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminPagos } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/session";

type PageProps = {
  searchParams?: Promise<{ dni?: string }>;
};

export default async function AdminPagosPage({ searchParams }: PageProps) {
  await requireRole(["administrativo"]);
  const params = (await searchParams) ?? {};
  const dni = params.dni?.trim() ?? "";
  const pagos = await getAdminPagos();
  const filtered = dni ? pagos.filter((pago) => (pago.alumno_dni ?? "").includes(dni)) : pagos;

  return (
    <>
      <PageHeader title="Pagos" description="Busqueda por DNI y actualizacion del estado mensual de pagos." />
      <form method="GET">
        <FilterPanel>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="dni">DNI del alumno</Label>
            <Input defaultValue={params.dni ?? ""} id="dni" name="dni" placeholder="Ingresa DNI" />
          </div>
          <div className="flex items-end">
            <Button className="w-full" variant="secondary" type="submit">Buscar pagos</Button>
          </div>
        </FilterPanel>
      </form>
      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alumno</TableHead>
                <TableHead>Periodo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha pago</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((pago) => (
                <TableRow key={pago.id}>
                  <TableCell>{pago.alumno}</TableCell>
                  <TableCell>{pago.alumno_dni ?? "-"}</TableCell>
                  <TableCell>{pago.periodo}</TableCell>
                  <TableCell>
                    <Badge variant={pago.estado === "pagado" ? "success" : "warning"}>{pago.estado}</Badge>
                  </TableCell>
                  <TableCell>{pago.monto ?? "-"}</TableCell>
                  <TableCell>{pago.fecha_pago ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState title="Busca un alumno para ver pagos" description="Ingresa el DNI para consultar y actualizar el estado mensual." />
      )}
    </>
  );
}
