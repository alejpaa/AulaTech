import { PageHeader } from "@/components/layout/page-header";
import { getDashboardAlumno } from "@/features/alumnos/services/dashboard.server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { AlertCircle, AlertTriangle, Calendar, CreditCard, Megaphone, CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";

export default async function AlumnoPage() {
  const profile = await requireRole(["alumno"]);
  const data = await getDashboardAlumno(profile.id);

  // Determine semaphore colors
  let semaphoreBg = "bg-slate-200";
  let textColor = "text-slate-400";

  if (data.globalAverage !== null) {
    textColor = "text-white";
    if (data.globalAverage >= 11) semaphoreBg = "bg-green-500";
    else if (data.globalAverage < 10) semaphoreBg = "bg-red-500";
    else semaphoreBg = "bg-orange-500";
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Panel alumno" description="Resumen Ejecutivo de tu rendimiento y estado actual." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Central Semaphore with Performance & Attendance */}
        <Card className="md:col-span-2 flex flex-col p-8 border-slate-100 shadow-sm min-h-[400px] justify-between">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-4">
            Resumen del Rendimiento Escolar
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 py-4">
            {/* Left: Semaphores Side-by-Side */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">
                Indicadores del Periodo
              </p>

              <div className="flex items-center justify-center gap-8 pt-2">
                {/* Circle 1: Promedio */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-28 h-28 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 duration-300 ${semaphoreBg}`}>
                    <span className="text-3xl font-extrabold text-white tracking-tighter">
                      {data.globalAverage !== null ? data.globalAverage.toFixed(1) : "--"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">
                    Promedio Global
                  </span>
                </div>

                {/* Circle 2: Asistencia */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center shadow-lg transition-transform hover:scale-105 duration-300 text-white">
                    <span className="text-3xl font-extrabold tracking-tighter">
                      {data.attendancePercentage !== null ? `${data.attendancePercentage}%` : "--"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">
                    Asistencia Total
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Message Alert & Academic Status */}
            <div className="lg:col-span-6 flex flex-col justify-center w-full">
              {data.globalAverage === null ? (
                <div className="bg-slate-50 border border-slate-200 text-slate-600 p-4 rounded-xl flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 leading-tight">Sin notas registradas</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Aún no cuentas con calificaciones para el periodo actual. Te notificaremos en cuanto tus profesores carguen tus notas.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {data.globalAverage >= 11 ? (
                    <div className="bg-green-50/70 border border-green-100 text-green-800 p-4 rounded-xl flex items-start gap-3 shadow-sm shadow-green-100/30">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-green-900 leading-tight">¡Buen rendimiento académico!</h4>
                        <p className="text-xs text-green-700 mt-1 leading-relaxed">
                          Te encuentras en una posición sólida académicamente. Sigue esforzándote de la misma manera para mantener este excelente promedio.
                        </p>
                      </div>
                    </div>
                  ) : data.globalAverage >= 10 ? (
                    <div className="bg-orange-50/70 border border-orange-100 text-orange-800 p-4 rounded-xl flex items-start gap-3 shadow-sm shadow-orange-100/30">
                      <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-orange-900 leading-tight">Requiere Observación</h4>
                        <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                          Tu rendimiento académico se encuentra en el límite regular. Te recomendamos repasar los temas más difíciles para asegurar tu progreso constante.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50/70 border border-red-100 text-red-800 p-4 rounded-xl flex items-start gap-3 shadow-sm shadow-red-100/30">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-red-900 leading-tight">Necesita Recuperación</h4>
                        <p className="text-xs text-red-700 mt-1 leading-relaxed">
                          Tu rendimiento general es crítico. Es sumamente importante que coordines sesiones de recuperación con tus profesores para los cursos desaprobados.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Right Column: Upcoming Payment & Latest Announcement */}
        <div className="flex flex-col gap-6">
          {/* Upcoming Payment */}
          <Card className="border-slate-100 shadow-sm flex flex-col h-1/2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-500 font-medium flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Próximo Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {data.upcomingPayment ? (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-lg font-semibold text-slate-800">{data.upcomingPayment.month}</span>
                    <StatusBadge status={data.upcomingPayment.status} variant={data.upcomingPayment.status === "VENCIDA" ? "danger" : "default"} />
                  </div>
                  <div className="text-4xl font-bold text-red-600 mb-6 tracking-tight">
                    S/ {data.upcomingPayment.amount}
                  </div>
                  <div className="mt-auto">
                    <Link href="/alumno/pagos" className="w-full block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Ver estado de pagos
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-slate-800 font-semibold">Al día</p>
                  <p className="text-sm text-slate-500 mt-1 mb-4">No tienes pagos pendientes.</p>
                  <Link href="/alumno/pagos" className="w-full block mt-auto">
                    <Button variant="outline" className="w-full">
                      Ver historial
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Latest Announcement */}
          <Card className={`border-slate-100 shadow-sm flex flex-col h-1/2 ${data.latestAnnouncement ? 'border-l-4 border-l-orange-400' : ''}`}>
            <CardHeader className="pb-2">
              {data.latestAnnouncement ? (
                <div className="flex justify-between items-center mb-1">
                  <StatusBadge status={data.latestAnnouncement.tag} variant="warning" />
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {data.latestAnnouncement.date}
                  </span>
                </div>
              ) : (
                <CardTitle className="text-sm text-slate-500 font-medium flex items-center gap-2">
                  <Megaphone className="w-4 h-4" />
                  Comunicados
                </CardTitle>
              )}
              {data.latestAnnouncement && (
                <CardTitle className="text-base font-bold text-slate-800 leading-tight">
                  {data.latestAnnouncement.title}
                </CardTitle>
              )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {data.latestAnnouncement ? (
                <>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {data.latestAnnouncement.excerpt}
                  </p>
                  <Link href="/alumno/comunicados" className="w-full block mt-auto">
                    <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
                      Leer más
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                  <FileText className="w-10 h-10 text-slate-200 mb-3" />
                  <p className="text-sm text-slate-500">No hay comunicados recientes.</p>
                  <Link href="/alumno/comunicados" className="w-full block mt-4">
                    <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
                      Ir a comunicados
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
