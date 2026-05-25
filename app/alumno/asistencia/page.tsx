import { requireRole } from "@/lib/auth/session";
import { PageHeader } from "@/components/layout/page-header";
import { getMiAsistencia } from "@/features/asistencia/services/asistencia.server";
import { AsistenciaFilter } from "./AsistenciaFilter";
import { AsistenciaSummary } from "./AsistenciaSummary";
import { AsistenciaHistory } from "./AsistenciaHistory";
import { EmptyState } from "@/components/layout/empty-state";

type PageProps = {
  searchParams: Promise<{ bimestreId?: string }>;
};

export default async function AlumnoAsistenciaPage({ searchParams }: PageProps) {
  const profile = await requireRole(["alumno"]);
  const params = await searchParams;

  const {
    bimestres,
    selectedBimestreId,
    asistencias,
    stats,
    monthlyStats
  } = await getMiAsistencia(profile.id, params.bimestreId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi asistencia"
        description="Consulta tu porcentaje de asistencia por bimestre e historial detallado de inasistencias."
      />

      {/* Selector de Bimestre */}
      <AsistenciaFilter
        bimestres={bimestres}
        selectedBimestreId={selectedBimestreId}
      />

      {selectedBimestreId ? (
        <div className="space-y-6">
          {/* Resumen de Gráficas */}
          <AsistenciaSummary
            stats={stats}
            monthlyStats={monthlyStats}
          />

          {/* Historial Detallado */}
          <AsistenciaHistory
            asistencias={asistencias}
          />
        </div>
      ) : (
        <EmptyState
          title="Sin asistencia para mostrar"
          description="Selecciona un bimestre para revisar tu historial de asistencia."
        />
      )}
    </div>
  );
}
