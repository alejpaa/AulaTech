import { PageHeader } from "@/components/layout/page-header";
import { getComunicadosAdminFiltered } from "@/features/comunicados/services/comunicados.server";
import { ComunicadosGrid } from "@/app/alumno/comunicados/ComunicadosGrid";
import { EmptyState } from "@/components/layout/empty-state";
import { FilterPanel } from "@/components/layout/filter-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";

type AdminComunicadosPageProps = {
  searchParams?: Promise<{
    titulo?: string;
    destinatario?: string;
  }>;
};

async function publishComunicado(formData: FormData) {
  "use server";

  const profile = await requireRole(["administrativo"]);
  const titulo = String(formData.get("titulo") ?? "").trim();
  const destinatarioRaw = String(formData.get("destinatario") ?? "").trim();
  const contenido = String(formData.get("contenido") ?? "").trim();
  const destinatario = destinatarioRaw === "" ? null : destinatarioRaw;

  if (!titulo || !contenido) {
    redirect("/admin/comunicados?error=campos_requeridos");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("comunicados").insert({
    titulo,
    contenido,
    destinatario,
    publicado: true,
    created_by: profile.id,
  });

  if (error) {
    console.error("Error creating comunicado:", error);
    redirect("/admin/comunicados?error=guardar");
  }

  revalidatePath("/admin/comunicados");
  redirect("/admin/comunicados?success=1");
}

export default async function AdminComunicadosPage({ searchParams }: AdminComunicadosPageProps) {
  await requireRole(["administrativo"]);
  const params = (await searchParams) ?? {};
  const titulo = params.titulo?.trim() ?? "";
  const destinatario = params.destinatario?.trim() ?? "todos";
  const comunicados = await getComunicadosAdminFiltered({ titulo, destinatario });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comunicados"
        description="Lista, redacta y publica comunicados institucionales por rol."
      />

      <form method="GET">
        <FilterPanel>
          <div className="space-y-2">
            <Label htmlFor="titulo">Buscar</Label>
            <Input defaultValue={titulo} id="titulo" name="titulo" placeholder="Titulo o contenido" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destinatario">Destinatario</Label>
            <Select defaultValue={destinatario} id="destinatario" name="destinatario">
              <option value="todos">Todos</option>
              <option value="profesor">Profesores</option>
              <option value="alumno">Alumnos</option>
            </Select>
          </div>
          <div className="flex items-end">
            <Button className="w-full gap-2" type="submit" variant="secondary">
              <Search className="h-4 w-4" />
              Buscar
            </Button>
          </div>
        </FilterPanel>
      </form>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <section>
          {comunicados.length > 0 ? (
            <ComunicadosGrid comunicados={comunicados} />
          ) : (
            <EmptyState
              title="Sin comunicados disponibles"
              description="Aquí se listarán todos los comunicados y avisos institucionales vigentes para el administrador."
            />
          )}
        </section>

        <Card id="nuevo-comunicado">
          <CardHeader>
            <CardTitle>Nuevo comunicado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={publishComunicado} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Titulo</Label>
                <Input id="titulo" name="titulo" placeholder="Ej. Reunion de padres" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinatario">Destinatario</Label>
                <Select id="destinatario" name="destinatario" defaultValue="">
                  <option value="">Todos</option>
                  <option value="profesor">Profesores</option>
                  <option value="alumno">Alumnos</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contenido">Contenido</Label>
                <Textarea id="contenido" name="contenido" placeholder="Redacta el comunicado" />
              </div>
              <Button className="w-full" type="submit">Publicar</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
