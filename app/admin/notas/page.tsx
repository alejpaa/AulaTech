import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/layout/empty-state";
import { FilterPanel } from "@/components/layout/filter-panel";
import { PageHeader } from "@/components/layout/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminNotas } from "@/lib/supabase/admin";
import { loadReferenceMaps } from "@/lib/supabase/lookups";
import { requireRole } from "@/lib/auth/session";

type PageProps = {
  searchParams?: Promise<{ salon?: string; bimestre?: string; curso?: string }>;
};

export default async function AdminNotasPage({ searchParams }: PageProps) {
  await requireRole(["administrativo"]);
  const params = (await searchParams) ?? {};
  const salon = params.salon?.trim().toLowerCase() ?? "";
  const bimestre = params.bimestre?.trim().toLowerCase() ?? "";
  const curso = params.curso?.trim().toLowerCase() ?? "";

  const [notas, refs] = await Promise.all([getAdminNotas(), loadReferenceMaps()]);
  const salonOptions = Array.from(refs.salonesById.values());
  const bimestreOptions = Array.from(refs.bimestresById.values());
  const cursoOptions = Array.from(refs.cursosById.values());

  const filtered = notas.filter((nota) => {
    const matchesSalon = !salon || (nota.salon_nombre ?? "").toLowerCase().includes(salon);
    const matchesBimestre = !bimestre || nota.bimestre.toLowerCase().includes(bimestre);
    const matchesCurso = !curso || nota.curso.toLowerCase().includes(curso);
    return matchesSalon && matchesBimestre && matchesCurso;
  });

  return (
    <>
      <PageHeader title="Notas" description="Consulta por salon, bimestre y curso con nota mensual, bimestral y promedio." />
      <form method="GET">
        <FilterPanel>
          <div className="space-y-2">
            <Label htmlFor="salon">Salon</Label>
            <Select defaultValue={params.salon ?? ""} id="salon" name="salon">
              <option value="">Seleccionar salon</option>
              {salonOptions.map((salonOption) => (
                <option key={salonOption.id} value={salonOption.nombre ?? ""}>
                  {salonOption.nombre ?? "Sin nombre"}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bimestre">Bimestre</Label>
            <Select defaultValue={params.bimestre ?? ""} id="bimestre" name="bimestre">
              <option value="">Seleccionar bimestre</option>
              {bimestreOptions.map((item) => (
                <option key={item.id} value={item.nombre ?? ""}>
                  {item.nombre ?? "Sin nombre"}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="curso">Curso</Label>
            <Select defaultValue={params.curso ?? ""} id="curso" name="curso">
              <option value="">Seleccionar curso</option>
              {cursoOptions.map((item) => (
                <option key={item.id} value={item.nombre ?? ""}>
                  {item.nombre ?? "Sin nombre"}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-end"><Button className="w-full" variant="secondary" type="submit">Consultar</Button></div>
        </FilterPanel>
      </form>
      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alumno</TableHead>
                <TableHead>Salon</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Bimestre</TableHead>
                <TableHead>Mensual</TableHead>
                <TableHead>Bimestral</TableHead>
                <TableHead>Promedio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((nota) => (
                <TableRow key={nota.id}>
                  <TableCell>{nota.alumno}</TableCell>
                  <TableCell>{nota.salon_nombre ?? "-"}</TableCell>
                  <TableCell>{nota.curso}</TableCell>
                  <TableCell>{nota.bimestre}</TableCell>
                  <TableCell>{nota.nota_mensual ?? "-"}</TableCell>
                  <TableCell>{nota.nota_bimestral ?? "-"}</TableCell>
                  <TableCell><Badge variant={nota.promedio && nota.promedio >= 13 ? "success" : "warning"}>{nota.promedio ?? "-"}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState title="Selecciona filtros para consultar notas" description="Elige salon, bimestre y curso para ver el resumen de notas." />
      )}
    </>
  );
}
