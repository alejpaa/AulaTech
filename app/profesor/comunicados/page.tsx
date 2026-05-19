import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";

export default function ProfesorComunicadosPage() {
  return (
    <>
      <PageHeader title="Comunicados" description="Comunicados institucionales publicados para profesores." />
      <EmptyState title="Sin comunicados disponibles" description="Aqui se mostraran los comunicados publicados para profesores." />
    </>
  );
}
