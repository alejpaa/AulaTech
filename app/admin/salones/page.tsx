import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/layout/empty-state";
import { FilterPanel } from "@/components/layout/filter-panel";
import { PageHeader } from "@/components/layout/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminSalones } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { RecordModal, type RecordActionState } from "@/components/layout/record-modal";

type PageProps = {
  searchParams?: Promise<{ nombre?: string; grado?: string; seccion?: string }>;
};

async function createSalon(_: RecordActionState, formData: FormData): Promise<RecordActionState> {
  "use server";

  await requireRole(["administrativo"]);

  const nombre = String(formData.get("nombre") ?? "").trim();
  const grado = String(formData.get("grado") ?? "").trim();
  const seccion = String(formData.get("seccion") ?? "").trim();
  const nivel = String(formData.get("nivel") ?? "").trim() || null;

  if (!nombre || !grado || !seccion) {
    return { status: "error", message: "Completa los campos obligatorios." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("salones").insert({
    nombre,
    grado,
    seccion,
    nivel,
    activo: true,
  });

  if (error) {
    console.error("Error creating salon:", error);
    return { status: "error", message: "No se pudo registrar el salon." };
  }

  revalidatePath("/admin/salones");
  return { status: "success", message: "Registrado correctamente" };
}

export default async function AdminSalonesPage({ searchParams }: PageProps) {
  await requireRole(["administrativo"]);
  const params = (await searchParams) ?? {};
  const nombre = params.nombre?.trim().toLowerCase() ?? "";
  const grado = params.grado?.trim().toLowerCase() ?? "";
  const seccion = params.seccion?.trim().toLowerCase() ?? "";
  const salones = await getAdminSalones();
  const filtered = salones.filter((salon) => {
    const matchesNombre = !nombre || salon.nombre.toLowerCase().includes(nombre);
    const matchesGrado = !grado || salon.grado.toLowerCase().includes(grado);
    const matchesSeccion = !seccion || salon.seccion.toLowerCase().includes(seccion);
    return matchesNombre && matchesGrado && matchesSeccion;
  });

  return (
    <>
      <PageHeader
        title="Salones"
        description="Registro y edicion de grados, secciones y niveles."
        actions={
          <RecordModal
            triggerLabel="Registrar salon"
            title="Nuevo salon"
            submitLabel="Guardar salon"
            action={createSalon}
          >
            <div className="space-y-2"><Label htmlFor="nombre-salon">Nombre</Label><Input id="nombre-salon" name="nombre" placeholder="1ro A Primaria" /></div>
            <div className="space-y-2"><Label htmlFor="grado-salon">Grado</Label><Input id="grado-salon" name="grado" placeholder="1ro" /></div>
            <div className="space-y-2"><Label htmlFor="seccion-salon">Seccion</Label><Input id="seccion-salon" name="seccion" placeholder="A" /></div>
            <div className="space-y-2"><Label htmlFor="nivel-salon">Nivel</Label><Input id="nivel-salon" name="nivel" placeholder="Primaria" /></div>
          </RecordModal>
        }
      />
      <form method="GET">
        <FilterPanel>
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input defaultValue={params.nombre ?? ""} id="nombre" name="nombre" placeholder="1ro A Primaria" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grado">Grado</Label>
            <Input defaultValue={params.grado ?? ""} id="grado" name="grado" placeholder="1ro" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seccion">Seccion</Label>
            <Input defaultValue={params.seccion ?? ""} id="seccion" name="seccion" placeholder="A" />
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
                <TableHead>Salon</TableHead>
                <TableHead>Grado</TableHead>
                <TableHead>Seccion</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((salon) => (
                <TableRow key={salon.id}>
                  <TableCell>
                    <div className="font-medium text-slate-950">{salon.nombre}</div>
                    <div className="text-sm text-slate-500">{salon.nivel ?? "Sin nivel"}</div>
                  </TableCell>
                  <TableCell>{salon.grado}</TableCell>
                  <TableCell>{salon.seccion}</TableCell>
                  <TableCell>
                    <Badge variant={salon.activo ? "success" : "danger"}>{salon.activo ? "Activo" : "Inactivo"}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState title="Sin salones registrados" description="Registra salones para organizar alumnos, cursos y profesores." />
      )}
    </>
  );
}
