import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/layout/empty-state";
import { FilterPanel } from "@/components/layout/filter-panel";
import { PageHeader } from "@/components/layout/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminAlumnos, getNextSequentialCode } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { RecordModal, type RecordActionState } from "@/components/layout/record-modal";
import { CreateAlumnoForm } from "@/components/forms/create-alumno-form";
import { AlumnosFilter } from "@/components/forms/alumnos-filter";

type PageProps = {
  searchParams?: Promise<{ apellidos?: string; nombres?: string; dni?: string; nivel?: string; grado?: string; seccion?: string }>;
};

async function createAlumno(_: RecordActionState, formData: FormData): Promise<RecordActionState> {
  "use server";

  await requireRole(["administrativo"]);

  const nombres = String(formData.get("nombres") ?? "").trim();
  const apellidos = String(formData.get("apellidos") ?? "").trim();
  const dni = String(formData.get("dni") ?? "").trim() || null;
  const fechaNacimiento = String(formData.get("fecha_nacimiento") ?? "").trim() || null;
  const salonId = String(formData.get("salon_id") ?? "").trim() || null;

  if (!nombres || !apellidos) {
    return { status: "error", message: "Completa los campos obligatorios." };
  }

  const supabase = await createSupabaseServerClient();
  const codigo = await getNextSequentialCode("alumnos", "A-");
  const { error } = await supabase.from("alumnos").insert({
    nombres,
    apellidos,
    codigo,
    dni,
    fecha_nacimiento: fechaNacimiento,
    salon_id: salonId,
    activo: true,
  });

  if (error) {
    console.error("Error creating alumno:", error);
    return { status: "error", message: "No se pudo registrar el alumno." };
  }

  revalidatePath("/admin/alumnos");
  return { status: "success", message: "Registrado correctamente" };
}

export default async function AdminAlumnosPage({ searchParams }: PageProps) {
  await requireRole(["administrativo"]);
  const params = (await searchParams) ?? {};
  const apellidos = params.apellidos?.trim().toLowerCase() ?? "";
  const nombres = params.nombres?.trim().toLowerCase() ?? "";
  const dni = params.dni?.trim().toLowerCase() ?? "";
  const nivel = params.nivel?.trim().toLowerCase() ?? "";
  const grado = params.grado?.trim().toLowerCase() ?? "";
  const seccion = params.seccion?.trim().toLowerCase() ?? "";
  
  const alumnos = await getAdminAlumnos();
  const filtered = alumnos.filter((alumno) => {
    const matchesApellidos = !apellidos || alumno.apellidos.toLowerCase().includes(apellidos);
    const matchesNombres = !nombres || alumno.nombres.toLowerCase().includes(nombres);
    const matchesDni = !dni || (alumno.dni?.toLowerCase().includes(dni) ?? false);
    const matchesNivel = !nivel || (alumno.salon_nivel?.toLowerCase().includes(nivel) ?? false);
    const matchesGrado = !grado || (alumno.salon_grado?.toLowerCase().includes(grado) ?? false);
    const matchesSeccion = !seccion || (alumno.salon_seccion?.toLowerCase().includes(seccion) ?? false);
    return matchesApellidos && matchesNombres && matchesDni && matchesNivel && matchesGrado && matchesSeccion;
  });

  return (
    <>
      <PageHeader
        title="Alumnos"
        description="Busqueda, listado, registro, edicion y desactivacion de alumnos."
        actions={
          <RecordModal
            triggerLabel="Registrar alumno"
            title="Nuevo alumno"
            submitLabel="Guardar alumno"
            action={createAlumno}
          >
            <CreateAlumnoForm />
          </RecordModal>
        }
      />
      <AlumnosFilter />
      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alumno</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Salon</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((alumno) => (
                <TableRow key={alumno.id}>
                  <TableCell>
                    <div className="font-medium text-slate-950">{alumno.apellidos}, {alumno.nombres}</div>
                    <div className="text-sm text-slate-500">{alumno.codigo ?? "Sin codigo"}</div>
                  </TableCell>
                  <TableCell>{alumno.dni ?? "-"}</TableCell>
                  <TableCell>
                    {alumno.salon_nombre ? (
                      <div>
                        <div className="font-medium text-slate-950">{alumno.salon_nombre}</div>
                        <div className="text-sm text-slate-500">{alumno.salon_grado} {alumno.salon_seccion}{alumno.salon_nivel ? ` · ${alumno.salon_nivel}` : ""}</div>
                      </div>
                    ) : (
                      <span className="text-slate-500">Sin salon</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={alumno.activo ? "success" : "danger"}>{alumno.activo ? "Activo" : "Inactivo"}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState title="Sin alumnos para mostrar" description="Usa los filtros para buscar alumnos o registra uno nuevo." />
      )}
    </>
  );
}
