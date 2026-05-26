"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export type RecordActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

const initialState: RecordActionState = {
  status: "idle",
  message: null,
};

type RecordModalProps = {
  triggerLabel: string;
  title: string;
  submitLabel: string;
  action: (state: RecordActionState, formData: FormData) => Promise<RecordActionState>;
  children: ReactNode;
};

export function RecordModal({ triggerLabel, title, submitLabel, action, children }: RecordModalProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(action, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      const timeoutId = window.setTimeout(() => {
        setOpen(false);
      }, 1200);

      router.refresh();

      return () => window.clearTimeout(timeoutId);
    }
  }, [router, state.status]);

  return (
    <>
      <Button variant="outline" type="button" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg">
            <Card className="overflow-hidden border-slate-200 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-slate-100">
                <CardTitle>{title}</CardTitle>
                <Button variant="ghost" size="sm" type="button" onClick={() => setOpen(false)} aria-label="Cerrar ventana">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.message ? (
                  <div className={`rounded-lg border px-3 py-2 text-sm ${state.status === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
                    {state.message}
                  </div>
                ) : null}

                <form action={formAction} className="space-y-4">
                  {children}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={pending}>
                      {pending ? "Guardando..." : submitLabel}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </>
  );
}
