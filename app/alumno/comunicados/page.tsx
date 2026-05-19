import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";

export default function AlumnoComunicadosPage() {
  return (
    <>
      <PageHeader title="Comunicados" description="Comunicados institucionales publicados para alumnos." />
      <EmptyState title="Sin comunicados disponibles" description="Aqui se listaran los comunicados vigentes para alumnos." />
    </>
  );
}
