import { requireRole } from "@/lib/auth/session";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { getComunicadosPadre } from "@/features/comunicados/services/comunicados.server";
import { getHijosDelPadre } from "@/features/padres/services/padres.server";
import { PadreChildSelect } from "@/components/forms/padre-child-select";
import { ComunicadosGrid } from "@/app/alumno/comunicados/ComunicadosGrid";

type PageProps = {
  searchParams: Promise<{ hijoId?: string }>;
};

export default async function PadreComunicadosPage({ searchParams }: PageProps) {
  const profile = await requireRole(["padre"]);
  const params = await searchParams;

  const hijos = await getHijosDelPadre(profile.id);
  const selectedChildId = params.hijoId ?? hijos[0]?.id ?? null;
  const selectedChild = hijos.find((hijo) => hijo.id === selectedChildId) ?? hijos[0] ?? null;

  if (!selectedChild) {
    return (
      <div className="space-y-6">
        <PageHeader title="Comunicados" description="Revisa los avisos institucionales para tu hijo." />
        <EmptyState
          title="No hay hijos vinculados"
          description="Contacta al colegio para asociar un estudiante a tu cuenta de padre."
        />
      </div>
    );
  }

  const comunicados = await getComunicadosPadre();

  return (
    <div className="space-y-6">
      <PageHeader title="Comunicados" description={`Avisos y comunicados para ${selectedChild.nombres} ${selectedChild.apellidos}.`} />
      <PadreChildSelect hijos={hijos} selectedChildId={selectedChild.id} basePath="/padre/comunicados" />

      {comunicados.length === 0 ? (
        <EmptyState title="Sin comunicados disponibles" description="Aún no se han publicado avisos para el curso de tu hijo." />
      ) : (
        <ComunicadosGrid comunicados={comunicados} />
      )}
    </div>
  );
}
