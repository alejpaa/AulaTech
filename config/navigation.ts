import type { AppRole } from "@/lib/auth/roles";

export type NavigationItem = {
  title: string;
  href: string;
  description: string;
};

export const roleNavigation: Record<AppRole, NavigationItem[]> = {
  administrativo: [
    { title: "Comunicados", href: "/admin/comunicados", description: "Publicacion institucional" },
    { title: "Alumnos", href: "/admin/alumnos", description: "Gestion y busqueda" },
    { title: "Profesores", href: "/admin/profesores", description: "Gestion docente" },
    { title: "Salones", href: "/admin/salones", description: "Grados y secciones" },
    { title: "Notas", href: "/admin/notas", description: "Consulta academica" },
    { title: "Pagos", href: "/admin/pagos", description: "Estados mensuales" },
  ],
  profesor: [
    { title: "Comunicados", href: "/profesor/comunicados", description: "Avisos publicados" },
    { title: "Alumnos", href: "/profesor/alumnos", description: "Alumnos asignados" },
    { title: "Asistencia", href: "/profesor/asistencia", description: "Registro semanal" },
    { title: "Notas", href: "/profesor/notas", description: "Carga de evaluaciones" },
    { title: "Perfil", href: "/profesor/perfil", description: "Informacion personal" },
  ],
  alumno: [
    { title: "Comunicados", href: "/alumno/comunicados", description: "Avisos institucionales" },
    { title: "Notas", href: "/alumno/notas", description: "Consulta y reporte" },
    { title: "Asistencia", href: "/alumno/asistencia", description: "Historial por bimestre" },
    { title: "Pagos", href: "/alumno/pagos", description: "Estado mensual" },
    { title: "Perfil", href: "/alumno/perfil", description: "Datos personales" },
  ],
};
