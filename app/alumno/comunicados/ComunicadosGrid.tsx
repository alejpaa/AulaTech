"use client";

import { useState } from "react";
import type { ComunicadoItem } from "@/features/comunicados/services/comunicados.server";
import { ComunicadoCard } from "./ComunicadoCard";
import { ComunicadoModal } from "./ComunicadoModal";

type ComunicadosGridProps = {
  comunicados: ComunicadoItem[];
};

export function ComunicadosGrid({ comunicados }: ComunicadosGridProps) {
  const [selectedComunicado, setSelectedComunicado] = useState<ComunicadoItem | null>(null);

  return (
    <>
      {/* Grid Responsivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {comunicados.map((comunicado) => (
          <ComunicadoCard
            key={comunicado.id}
            comunicado={comunicado}
            onRead={setSelectedComunicado}
          />
        ))}
      </div>

      {/* Modal Único de Detalles */}
      <ComunicadoModal
        comunicado={selectedComunicado}
        isOpen={selectedComunicado !== null}
        onClose={() => setSelectedComunicado(null)}
      />
    </>
  );
}
