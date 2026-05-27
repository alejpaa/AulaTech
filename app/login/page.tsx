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
    <main className="relative min-h-screen overflow-hidden lg:grid lg:grid-cols-2">
      {/* ── Left: Dark hero section ── */}
      <section className="login-gradient-bg relative hidden lg:flex items-center justify-center overflow-hidden p-12 xl:p-16">
        {/* Floating ambient shapes */}
        <div className="login-float-shape login-float-shape--1" />
        <div className="login-float-shape login-float-shape--2" />
        <div className="login-float-shape login-float-shape--3" />

        <div className="login-hero-content relative z-10 max-w-md">
          {/* Logo / brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-wide text-white">AULA-TECH</span>
          </div>

          {/* Main heading */}
          <h1 className="mt-12 text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
            Tu espacio escolar,{" "}
            <span className="text-blue-400">
              todo en un solo lugar
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-400">
            Consulta calificaciones, revisa asistencia y mantente al día con lo que pasa en tu escuela. Fácil y rápido.
          </p>
        </div>
      </section>

      {/* ── Right: White form section ── */}
      <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-slate-50 to-blue-50/60 px-5 py-10 sm:px-6 sm:py-12">
        <div className="w-full max-w-md">
          {/* Mobile-only branding */}
          <div className="mb-10 lg:hidden login-hero-content">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-wide text-slate-900">AULA-TECH</span>
            </div>
          </div>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}
