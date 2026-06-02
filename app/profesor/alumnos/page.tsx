import { PageHeader } from "@/components/layout/page-header";
import { getAlumnosAsignadosProfesor } from "@/features/alumnos/services/profesor.server";
import { AlumnosProfesorTable } from "@/features/alumnos/components/alumnos-profesor-table";

export default async function ProfesorAlumnosPage() {
  const alumnos = await getAlumnosAsignadosProfesor();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Alumnos asignados" 
        description="Listado consolidado de todos los alumnos que pertenecen a tus salones asignados." 
      />
      <AlumnosProfesorTable alumnos={alumnos} />
    </div>
  );
}
