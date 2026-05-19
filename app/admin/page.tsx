import { ModuleGrid } from "@/components/layout/module-grid";
import { PageHeader } from "@/components/layout/page-header";
import { roleNavigation } from "@/config/navigation";

export default function AdminPage() {
  return (
    <>
      <PageHeader title="Panel administrativo" description="Acceso a los modulos de gestion escolar y control institucional." />
      <ModuleGrid items={roleNavigation.administrativo} />
    </>
  );
}
