import { ModuleGrid } from "@/components/layout/module-grid";
import { PageHeader } from "@/components/layout/page-header";
import { roleNavigation } from "@/config/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const [alumnosResult, profesoresResult, salonesResult, comunicadosResult] = await Promise.all([
    supabase.from("alumnos").select("id", { count: "exact", head: true }),
    supabase.from("profesores").select("id", { count: "exact", head: true }),
    supabase.from("salones").select("id", { count: "exact", head: true }),
    supabase.from("comunicados").select("id", { count: "exact", head: true }),
  ]);

  const cards = [
    { label: "Alumnos", value: alumnosResult.count ?? 0 },
    { label: "Profesores", value: profesoresResult.count ?? 0 },
    { label: "Salones", value: salonesResult.count ?? 0 },
    { label: "Comunicados", value: comunicadosResult.count ?? 0 },
  ];

  return (
    <>
      <PageHeader title="Panel administrativo" description="Acceso a los modulos de gestion escolar y control institucional." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <ModuleGrid items={roleNavigation.administrativo} />
    </>
  );
}
