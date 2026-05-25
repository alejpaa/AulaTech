import { requireRole } from "@/lib/auth/session";
import { PageHeader } from "@/components/layout/page-header";
import { getMiPerfil } from "@/features/alumnos/services/perfil.server";
import { StudentCard } from "./StudentCard";
import { StudentInfo } from "./StudentInfo";
import { EmptyState } from "@/components/layout/empty-state";

export default async function AlumnoPerfilPage() {
  const profile = await requireRole(["alumno"]);
  const studentProfile = await getMiPerfil(profile.id);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Mi perfil" 
        description="Ficha del estudiante con información académica e institucional en modo consulta." 
      />

      {studentProfile ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tarjeta Tipo DNI de Identificación a la Izquierda */}
          <div className="lg:col-span-4 xl:col-span-4 w-full">
            <StudentCard profile={studentProfile} />
          </div>

          {/* Paneles de Datos Completos a la Derecha */}
          <div className="lg:col-span-8 xl:col-span-8 w-full">
            <StudentInfo profile={studentProfile} />
          </div>
        </div>
      ) : (
        <EmptyState 
          title="Ficha no disponible" 
          description="Hubo un problema al cargar tu perfil estudiantil. Contacta al administrador." 
        />
      )}
    </div>
  );
}
