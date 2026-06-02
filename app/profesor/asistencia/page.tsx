import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { getFiltrosAsistencia, getRegistroAsistencia, type AlumnoAsistencia } from "@/features/asistencia/services/profesor.server";
import { AsistenciaFilter } from "@/features/asistencia/components/asistencia-filter";
import { RegistroAsistenciaForm } from "@/features/asistencia/components/registro-asistencia-form";
import { CalendarCheck } from "lucide-react";

export default async function ProfesorAsistenciaPage(props: {
  searchParams: Promise<{ curso?: string; bimestre?: string; semana?: string; fecha?: string }>;
}) {
  const searchParams = await props.searchParams;
  const cursoParam = searchParams.curso;
  const bimestreId = searchParams.bimestre;
  const fecha = searchParams.fecha || new Date().toISOString().split('T')[0];

  // Cargar filtros disponibles para este profesor
  const { cursos, bimestres } = await getFiltrosAsistencia();

  // Validar si tenemos todos los filtros para mostrar la tabla
  const isReadyToFetch = cursoParam && bimestreId && fecha;
  let alumnosAsistencia: AlumnoAsistencia[] = [];
  let cursoId = "";
  let salonId = "";

  if (isReadyToFetch) {
    // cursoParam viene como "cursoId|salonId"
    const [cId, sId] = cursoParam.split("|");
    cursoId = cId;
    salonId = sId;

    if (cursoId && salonId) {
      alumnosAsistencia = await getRegistroAsistencia(cursoId, salonId, bimestreId, fecha);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Asistencia" 
        description="Selecciona los filtros para registrar o editar la asistencia de tus alumnos." 
      />
      
      <AsistenciaFilter cursos={cursos} bimestres={bimestres} />

      {isReadyToFetch && cursoId && salonId ? (
        alumnosAsistencia.length > 0 ? (
          <RegistroAsistenciaForm 
            key={`${cursoId}-${bimestreId}-${fecha}`}
            alumnos={alumnosAsistencia}
            cursoId={cursoId}
            bimestreId={bimestreId}
            fecha={fecha}
          />
        ) : (
          <EmptyState 
            title="Sin alumnos en este salón" 
            description="El salón seleccionado no tiene alumnos activos matriculados en este momento." 
          />
        )
      ) : (
        <EmptyState 
          title="Filtros incompletos" 
          description="Por favor selecciona el Curso, Bimestre, Semana y Fecha para abrir el registro de asistencia." 
          icon={<CalendarCheck className="w-10 h-10 text-slate-300" />}
        />
      )}
    </div>
  );
}
