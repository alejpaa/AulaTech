import { PageHeader } from "@/components/layout/page-header";
import { getPerfilProfesor } from "@/features/profesores/services/perfil.server";
import { PerfilForm } from "@/features/profesores/components/perfil-form";
import { TeacherCard } from "./TeacherCard";

export default async function ProfesorPerfilPage() {
  const perfil = await getPerfilProfesor();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Mi Perfil" 
        description="Gestiona tu información personal, de contacto y especialidad." 
      />
      
      {perfil && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tarjeta Tipo Credencial a la Izquierda */}
          <div className="lg:col-span-4 xl:col-span-4 w-full">
            <TeacherCard profile={perfil} />
          </div>

          {/* Formulario a la Derecha */}
          <div className="lg:col-span-8 xl:col-span-8 w-full">
            <PerfilForm initialData={perfil} />
          </div>
        </div>
      )}
    </div>
  );
}
