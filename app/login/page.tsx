import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/login-form";
import { getCurrentProfile } from "@/lib/auth/session";
import { roleHomePath } from "@/lib/auth/roles";

export default async function LoginPage() {
  const profile = await getCurrentProfile();

  if (profile) {
    redirect(roleHomePath(profile.rol));
  }

  return (
    <main className="grid min-h-screen bg-slate-950 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden p-10 text-white lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#38bdf8,_transparent_35%),radial-gradient(circle_at_bottom_right,_#6366f1,_transparent_30%)] opacity-70" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">AULA-TECH</p>
            <h1 className="mt-6 max-w-2xl text-5xl font-semibold tracking-tight">Gestion escolar segura por roles.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-200">
              Plataforma para administrativos, profesores y alumnos con acceso seguro y personalizado.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm text-slate-200">
            <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur">Notas</div>
            <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur">Asistencia</div>
            <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur">Pagos</div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-white lg:hidden">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">AULA-TECH</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Gestion escolar segura.</h1>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
