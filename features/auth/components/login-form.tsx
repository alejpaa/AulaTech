"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { loginSchema } from "../schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);

    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Datos invalidos");
      return;
    }

    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword(parsed.data);

      if (signInError) {
        setError("Correo o contrasena incorrectos");
        return;
      }

      const { data: profile } = await supabase
        .from("usuarios")
        .select("id, rol, activo")
        .eq("email", parsed.data.email)
        .eq("activo", true)
        .maybeSingle();

      if (!profile) {
        await supabase.auth.signOut();
        setError("Tu cuenta aun no tiene un perfil asignado. Contacta al administrador.");
        return;
      }

      router.refresh();
      router.push("/");
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Iniciar sesion</CardTitle>
        <CardDescription>Accede con tu correo y contrasena institucional.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input autoComplete="email" id="email" name="email" placeholder="usuario@colegio.edu" type="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contrasena</Label>
            <Input autoComplete="current-password" id="password" name="password" type="password" />
          </div>
          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <Button className="w-full" disabled={isPending} type="submit">
            {isPending ? "Validando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
