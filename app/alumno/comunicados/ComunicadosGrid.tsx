"use client";

import { useState } from "react";
import type { ComunicadoItem } from "@/features/comunicados/services/comunicados.server";
import { ComunicadoCard } from "@/app/alumno/comunicados/ComunicadoCard";
import { ComunicadoModal } from "@/app/alumno/comunicados/ComunicadoModal";

type ComunicadosGridProps = {
  comunicados: ComunicadoItem[];
};

export function ComunicadosGrid({ comunicados }: ComunicadosGridProps) {
  const [selected, setSelected] = useState<ComunicadoItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function onRead(item: ComunicadoItem) {
    setSelected(item);
    setIsOpen(true);
  }

  function onClose() {
    setIsOpen(false);
    setSelected(null);
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {comunicados.map((c) => (
          <ComunicadoCard key={c.id} comunicado={c} onRead={onRead} />
        ))}
      </div>

      <ComunicadoModal comunicado={selected} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
