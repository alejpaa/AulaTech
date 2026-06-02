import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { getComunicadosProfesor } from "@/features/comunicados/services/comunicados.server";
import { ComunicadosGrid } from "@/app/alumno/comunicados/ComunicadosGrid";
import { Bell } from "lucide-react";

export default async function ProfesorComunicadosPage() {
  const comunicados = await getComunicadosProfesor();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Comunicados Oficiales" 
        description="Mantente informado con las últimas noticias y avisos institucionales para el personal docente." 
      />
      
      {comunicados.length === 0 ? (
        <EmptyState 
          title="Sin comunicados" 
          description="Por el momento no hay comunicados institucionales publicados para ti." 
          icon={<Bell className="w-10 h-10 text-slate-300" />}
        />
      ) : (
        <ComunicadosGrid comunicados={comunicados} />
      )}
    </div>
  );
}
