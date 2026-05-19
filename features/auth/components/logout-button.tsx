"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.refresh();
      router.push("/login");
    });
  }

  return (
    <Button disabled={isPending} onClick={handleLogout} size="sm" type="button" variant="outline">
      {isPending ? "Saliendo..." : "Cerrar sesion"}
    </Button>
  );
}
