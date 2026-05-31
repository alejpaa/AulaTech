import { requireRole } from "@/lib/auth/session";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { getHijosDelPadre, getAsistenciaHijo } from "@/features/padres/services/padres.server";
import { PadreChildSelect } from "@/components/forms/padre-child-select";
import { AsistenciaFilter } from "./AsistenciaFilter";
import { AsistenciaSummary } from "@/app/alumno/asistencia/AsistenciaSummary";
import { AsistenciaHistory } from "@/app/alumno/asistencia/AsistenciaHistory";

type PageProps = {
  searchParams: Promise<{ hijoId?: string; bimestreId?: string }>;
};

export default async function PadreAsistenciaPage({ searchParams }: PageProps) {
  const profile = await requireRole(["padre"]);
  const params = await searchParams;

  const hijos = await getHijosDelPadre(profile.id);
  const selectedChildId = params.hijoId ?? hijos[0]?.id ?? null;
  const selectedChild = hijos.find((hijo) => hijo.id === selectedChildId) ?? hijos[0] ?? null;

  if (!selectedChild) {
    return (
      <div className="space-y-6">
        <PageHeader title="Asistencia del hijo" description="Revisa el historial de inasistencias y el porcentaje por bimestre." />
        <EmptyState
          title="No hay hijos vinculados"
          description="Contacta al colegio para asociar un estudiante a tu cuenta de padre."
        />
      </div>
    );
  }

  const {
    bimestres,
    selectedBimestreId,
    asistencias,
    stats,
    monthlyStats,
  } = await getAsistenciaHijo(selectedChild.id, params.bimestreId);

  return (
    <div className="space-y-6">
      <PageHeader title="Asistencia del hijo" description={`Historial de asistencia para ${selectedChild.nombres} ${selectedChild.apellidos}.`} />
      <PadreChildSelect hijos={hijos} selectedChildId={selectedChild.id} basePath="/padre/asistencia" />
      <AsistenciaFilter bimestres={bimestres} selectedBimestreId={selectedBimestreId} hijoId={selectedChild.id} />

      {selectedBimestreId ? (
        <div className="space-y-6">
          <AsistenciaSummary stats={stats} monthlyStats={monthlyStats} />
          <AsistenciaHistory asistencias={asistencias} />
        </div>
      ) : (
        <EmptyState title="Selecciona un bimestre" description="Elige un bimestre para revisar el historial de asistencia." />
      )}
    </div>
  );
}
