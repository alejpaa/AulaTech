import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { getFiltrosNotas, getRegistroNotas, type AlumnoNota } from "@/features/notas/services/profesor.server";
import { NotasFilter } from "@/features/notas/components/notas-filter";
import { RegistroNotasForm } from "@/features/notas/components/registro-notas-form";
import { ClipboardList } from "lucide-react";

export default async function ProfesorNotasPage(props: {
  searchParams: Promise<{ curso?: string; bimestre?: string }>;
}) {
  const searchParams = await props.searchParams;
  const cursoParam = searchParams.curso;
  const bimestreId = searchParams.bimestre;

  // Cargar filtros disponibles
  const { cursos, bimestres } = await getFiltrosNotas();

  // Validar
  const isReadyToFetch = cursoParam && bimestreId;
  let alumnosNotas: AlumnoNota[] = [];
  let cursoId = "";
  let salonId = "";

  if (isReadyToFetch) {
    const [cId, sId] = cursoParam.split("|");
    cursoId = cId;
    salonId = sId;

    if (cursoId && salonId) {
      alumnosNotas = await getRegistroNotas(cursoId, salonId, bimestreId);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Registro de Notas" 
        description="Ingresa las calificaciones de tus alumnos. El promedio se calcula automáticamente al guardar." 
      />
      
      <NotasFilter cursos={cursos} bimestres={bimestres} />

      {isReadyToFetch && cursoId && salonId ? (
        alumnosNotas.length > 0 ? (
          <RegistroNotasForm 
            key={`${cursoId}-${bimestreId}`}
            alumnos={alumnosNotas}
            cursoId={cursoId}
            bimestreId={bimestreId}
          />
        ) : (
          <EmptyState 
            title="Sin alumnos matriculados" 
            description="El salón seleccionado no tiene alumnos activos para este curso." 
          />
        )
      ) : (
        <EmptyState 
          title="Filtros requeridos" 
          description="Selecciona un Curso y un Bimestre para cargar el formulario de notas." 
          icon={<ClipboardList className="w-10 h-10 text-slate-300" />}
        />
      )}
    </div>
  );
}
