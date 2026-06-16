import type { AppRole } from "@/lib/auth/roles";

export type NavigationItem = {
  title: string;
  href: string;
  description: string;
  icon: string;
  badge?: number;
};

export const roleNavigation: Record<AppRole, NavigationItem[]> = {
  administrativo: [
    { title: "Comunicados", href: "/admin/comunicados", description: "Publicacion institucional", icon: "Megaphone" },
    { title: "Alumnos", href: "/admin/alumnos", description: "Gestion y busqueda", icon: "Users" },
    { title: "Profesores", href: "/admin/profesores", description: "Gestion docente", icon: "GraduationCap" },
    { title: "Salones", href: "/admin/salones", description: "Grados y secciones", icon: "BookOpen" },
    { title: "Notas", href: "/admin/notas", description: "Consulta academica", icon: "ClipboardList" },
    { title: "Pagos", href: "/admin/pagos", description: "Estados mensuales", icon: "CreditCard" },
  ],
  profesor: [
    { title: "Dashboard", href: "/profesor", description: "Resumen ejecutivo", icon: "LayoutDashboard" },
    { title: "Comunicados", href: "/profesor/comunicados", description: "Avisos publicados", icon: "Megaphone" },
    { title: "Alumnos", href: "/profesor/alumnos", description: "Alumnos asignados", icon: "Users" },
    { title: "Asistencia", href: "/profesor/asistencia", description: "Registro semanal", icon: "CalendarCheck" },
    { title: "Notas", href: "/profesor/notas", description: "Carga de evaluaciones", icon: "ClipboardList" },
    { title: "Perfil", href: "/profesor/perfil", description: "Informacion personal", icon: "User" },
  ],
  alumno: [
    { title: "Dashboard", href: "/alumno", description: "Resumen ejecutivo", icon: "LayoutDashboard" },
    { title: "Comunicados", href: "/alumno/comunicados", description: "Avisos institucionales", icon: "Megaphone" },
    { title: "Notas", href: "/alumno/notas", description: "Consulta y reporte", icon: "ClipboardList" },
    { title: "Asistencia", href: "/alumno/asistencia", description: "Historial por bimestre", icon: "CalendarCheck" },
    { title: "Pagos", href: "/alumno/pagos", description: "Estado mensual", icon: "CreditCard" },
    { title: "Perfil", href: "/alumno/perfil", description: "Datos personales", icon: "User" },
  ],
  padre: [
    { title: "Dashboard", href: "/padre", description: "Resumen de tu hijo", icon: "LayoutDashboard" },
    { title: "Comunicados", href: "/padre/comunicados", description: "Avisos para tu hijo", icon: "Megaphone" },
    { title: "Notas", href: "/padre/notas", description: "Calificaciones del hijo", icon: "ClipboardList" },
    { title: "Asistencia", href: "/padre/asistencia", description: "Historial de asistencia", icon: "CalendarCheck" },
    { title: "Pagos", href: "/padre/pagos", description: "Estado de pagos", icon: "CreditCard" },
  ],
};
