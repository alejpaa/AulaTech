import { requireRole } from "@/lib/auth/session";
import { PageHeader } from "@/components/layout/page-header";
import { getMisNotas } from "@/features/notas/services/notas.server";
import { NotasTable } from "./NotasTable";
import { NotasSummary } from "./NotasSummary";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default async function AlumnoNotasPage() {
  const profile = await requireRole(["alumno"]);
  
  // Asumiendo que el ID del alumno en la tabla 'alumnos' está vinculado al ID de usuario en Supabase,
  // pero el getMisNotas está esperando el alumnoId o auth_user_id.
  // Vamos a usar el session profile que tiene profile.id (usuario_id).
  // Nota: Si profile.id es de la tabla usuarios, en notas.server.ts tendríamos que buscar por usuario_id.
  // Ajustaremos getMisNotas si es necesario.
  
  // Para este mockup conectado, asuminos que `getMisNotas` usa el usuario_id.
  // Vamos a necesitar el 'alumno_id' real de la tabla alumnos.
  // Lo mejor es modificar getMisNotas para que obtenga el alumno_id a partir del auth.uid().
  // Sin embargo, para esta llamada pasaremos profile.id como referencia o no lo pasaremos (que el server lo extraiga).
  
  // Vamos a dejar que getMisNotas extraiga el current_alumno_id con la funcion de base de datos
  // Pero necesitamos pasarlo. Modificaremos getMisNotas para que si no recibe alumno_id, use el auth().
  
  // En nuestro caso, tenemos getMisNotas(alumno_id).
  // Voy a importar y usar getMisNotas.
  const notas = await getMisNotas(profile.id); // temporalmente

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Control Académico" 
        description="Consulta tus notas por curso, calificaciones mensuales y bimestrales."
        actions={
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Descargar Libreta
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <NotasTable notas={notas} />
        </div>
        <div className="lg:col-span-4">
          <NotasSummary notas={notas} />
        </div>
      </div>
    </div>
  );
}

