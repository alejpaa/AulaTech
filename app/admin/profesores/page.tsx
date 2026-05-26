import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/layout/empty-state";
import { FilterPanel } from "@/components/layout/filter-panel";
import { PageHeader } from "@/components/layout/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminProfesores, getNextSequentialCode } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { RecordModal, type RecordActionState } from "@/components/layout/record-modal";

type PageProps = {
  searchParams?: Promise<{ apellidos?: string; nombres?: string; especialidad?: string }>;
};

async function createProfesor(_: RecordActionState, formData: FormData): Promise<RecordActionState> {
  "use server";

  await requireRole(["administrativo"]);

  const nombres = String(formData.get("nombres") ?? "").trim();
  const apellidos = String(formData.get("apellidos") ?? "").trim();
  const dni = String(formData.get("dni") ?? "").trim() || null;
  const especialidad = String(formData.get("especialidad") ?? "").trim() || null;

  if (!nombres || !apellidos) {
    return { status: "error", message: "Completa los campos obligatorios." };
  }

  const supabase = await createSupabaseServerClient();
  const codigo = await getNextSequentialCode("profesores", "P-");
  const { error } = await supabase.from("profesores").insert({
    nombres,
    apellidos,
    codigo,
    dni,
    especialidad,
    activo: true,
  });

  if (error) {
    console.error("Error creating profesor:", error);
    return { status: "error", message: "No se pudo registrar el profesor." };
  }

  revalidatePath("/admin/profesores");
  return { status: "success", message: "Registrado correctamente" };
}

export default async function AdminProfesoresPage({ searchParams }: PageProps) {
  await requireRole(["administrativo"]);
  const params = (await searchParams) ?? {};
  const apellidos = params.apellidos?.trim().toLowerCase() ?? "";
  const nombres = params.nombres?.trim().toLowerCase() ?? "";
  const especialidad = params.especialidad?.trim().toLowerCase() ?? "";
  const profesores = await getAdminProfesores();
  const filtered = profesores.filter((profesor) => {
    const matchesApellidos = !apellidos || profesor.apellidos.toLowerCase().includes(apellidos);
    const matchesNombres = !nombres || profesor.nombres.toLowerCase().includes(nombres);
    const matchesEspecialidad = !especialidad || (profesor.especialidad ?? "").toLowerCase().includes(especialidad);
    return matchesApellidos && matchesNombres && matchesEspecialidad;
  });

  return (
    <>
      <PageHeader
        title="Profesores"
        description="Gestion docente, busqueda por filtros y asignacion academica."
        actions={
          <RecordModal
            triggerLabel="Registrar profesor"
            title="Nuevo profesor"
            submitLabel="Guardar profesor"
            action={createProfesor}
          >
            <div className="space-y-2"><Label htmlFor="prof-nombres">Nombres</Label><Input id="prof-nombres" name="nombres" placeholder="Nombre(s)" /></div>
            <div className="space-y-2"><Label htmlFor="prof-apellidos">Apellidos</Label><Input id="prof-apellidos" name="apellidos" placeholder="Apellido(s)" /></div>
            <div className="space-y-2"><Label htmlFor="prof-dni">DNI</Label><Input id="prof-dni" name="dni" placeholder="00000000" /></div>
            <div className="space-y-2"><Label htmlFor="prof-especialidad">Especialidad</Label><Input id="prof-especialidad" name="especialidad" placeholder="Matematica, Comunicacion..." /></div>
          </RecordModal>
        }
      />
      <form method="GET">
        <FilterPanel>
          <div className="space-y-2">
            <Label htmlFor="apellidos">Apellidos</Label>
            <Input defaultValue={params.apellidos ?? ""} id="apellidos" name="apellidos" placeholder="Buscar por apellidos" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nombres">Nombres</Label>
            <Input defaultValue={params.nombres ?? ""} id="nombres" name="nombres" placeholder="Buscar por nombres" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="especialidad">Especialidad</Label>
            <Input defaultValue={params.especialidad ?? ""} id="especialidad" name="especialidad" placeholder="Matematica, Comunicacion..." />
          </div>
          <div className="flex items-end">
            <Button className="w-full" variant="secondary" type="submit">Buscar</Button>
          </div>
        </FilterPanel>
      </form>
      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profesor</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((profesor) => (
                <TableRow key={profesor.id}>
                  <TableCell>
                    <div className="font-medium text-slate-950">{profesor.apellidos}, {profesor.nombres}</div>
                    <div className="text-sm text-slate-500">{profesor.codigo ?? "Sin codigo"}</div>
                  </TableCell>
                  <TableCell>{profesor.dni ?? "-"}</TableCell>
                  <TableCell>{profesor.especialidad ?? "Sin especialidad"}</TableCell>
                  <TableCell>
                    <Badge variant={profesor.activo ? "success" : "danger"}>{profesor.activo ? "Activo" : "Inactivo"}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState title="Sin profesores para mostrar" description="Usa los filtros para buscar profesores o registra uno nuevo." />
      )}
    </>
  );
}
