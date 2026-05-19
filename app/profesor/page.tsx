import { ModuleGrid } from "@/components/layout/module-grid";
import { PageHeader } from "@/components/layout/page-header";
import { roleNavigation } from "@/config/navigation";

export default function ProfesorPage() {
  return (
    <>
      <PageHeader title="Panel profesor" description="Gestion de alumnos asignados, asistencia, notas y comunicados." />
      <ModuleGrid items={roleNavigation.profesor} />
    </>
  );
}
