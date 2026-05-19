import { ModuleGrid } from "@/components/layout/module-grid";
import { PageHeader } from "@/components/layout/page-header";
import { roleNavigation } from "@/config/navigation";

export default function AlumnoPage() {
  return (
    <>
      <PageHeader title="Panel alumno" description="Consulta de notas, asistencia, pagos, perfil y comunicados." />
      <ModuleGrid items={roleNavigation.alumno} />
    </>
  );
}
