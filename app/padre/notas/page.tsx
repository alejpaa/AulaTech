import { requireRole } from "@/lib/auth/session";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { getHijosDelPadre, getNotasHijo } from "@/features/padres/services/padres.server";
import { PadreChildSelect } from "@/components/forms/padre-child-select";
import { NotasSummary } from "@/app/alumno/notas/NotasSummary";
import { NotasTable } from "@/app/alumno/notas/NotasTable";

type PageProps = {
  searchParams: Promise<{ hijoId?: string }>;
};

export default async function PadreNotasPage({ searchParams }: PageProps) {
  const profile = await requireRole(["padre"]);
  const params = await searchParams;

  const hijos = await getHijosDelPadre(profile.id);
  const selectedChildId = params.hijoId ?? hijos[0]?.id ?? null;
  const selectedChild = hijos.find((hijo) => hijo.id === selectedChildId) ?? hijos[0] ?? null;

  if (!selectedChild) {
    return (
      <div className="space-y-6">
        <PageHeader title="Notas de tu hijo" description="Consulta las evaluaciones registradas y los promedios por curso." />
        <EmptyState
          title="No hay hijos vinculados"
          description="Contacta al colegio para asociar un estudiante a tu cuenta de padre."
        />
      </div>
    );
  }

  const notas = await getNotasHijo(selectedChild.id);

  return (
    <div className="space-y-6">
      <PageHeader title="Notas del hijo" description={`Revisa las calificaciones de ${selectedChild.nombres} ${selectedChild.apellidos}.`} />
      <PadreChildSelect hijos={hijos} selectedChildId={selectedChild.id} basePath="/padre/notas" />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <section className="space-y-6">
          <NotasTable notas={notas} />
        </section>
        <aside className="space-y-6">
          <NotasSummary notas={notas} />
        </aside>
      </div>
    </div>
  );
}
