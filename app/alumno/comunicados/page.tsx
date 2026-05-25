import { requireRole } from "@/lib/auth/session";
import { PageHeader } from "@/components/layout/page-header";
import { getComunicadosAlumno } from "@/features/comunicados/services/comunicados.server";
import { ComunicadosGrid } from "./ComunicadosGrid";
import { EmptyState } from "@/components/layout/empty-state";

export default async function AlumnoComunicadosPage() {
  // Asegurar acceso únicamente a alumnos
  await requireRole(["alumno"]);
  const comunicados = await getComunicadosAlumno();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comunicados Oficiales"
        description="Mantente informado con las últimas noticias y avisos institucionales dirigidos a la comunidad escolar."
      />

      {comunicados.length === 0 ? (
        <EmptyState
          title="Sin comunicados disponibles"
          description="Aquí se listarán todos los comunicados y avisos institucionales vigentes para ti."
        />
      ) : (
        <ComunicadosGrid comunicados={comunicados} />
      )}
    </div>
  );
}
