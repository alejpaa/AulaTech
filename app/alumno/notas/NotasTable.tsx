import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MiniProgressBar } from "@/components/ui/mini-progress-bar";
import { cn } from "@/lib/utils/cn";
import type { NotaItem } from "@/features/notas/services/notas.server";

type NotasTableProps = {
  notas: NotaItem[];
};

export function NotasTable({ notas }: NotasTableProps) {
  const getNotaColor = (nota: number | null) => {
    if (nota === null) return "text-slate-400";
    if (nota < 10) return "text-red-600 font-semibold";
    if (nota >= 11) return "text-green-600 font-semibold";
    return "text-orange-500 font-semibold"; // 10 to 10.9
  };

  const formatNota = (nota: number | null) => {
    if (nota === null) return "-";
    return nota.toFixed(1);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="font-semibold text-slate-900">Curso</TableHead>
            <TableHead className="text-right font-semibold text-slate-900">Nota Mensual</TableHead>
            <TableHead className="text-right font-semibold text-slate-900">Nota Bimestral</TableHead>
            <TableHead className="text-right font-semibold text-slate-900">Promedio</TableHead>
            <TableHead className="w-[120px] font-semibold text-slate-900">Progreso/20</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                No hay notas registradas para este periodo.
              </TableCell>
            </TableRow>
          ) : (
            notas.map((nota) => (
              <TableRow key={nota.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-slate-900">{nota.curso}</TableCell>
                <TableCell className={cn("text-right", getNotaColor(nota.nota_mensual))}>
                  {formatNota(nota.nota_mensual)}
                </TableCell>
                <TableCell className={cn("text-right", getNotaColor(nota.nota_bimestral))}>
                  {formatNota(nota.nota_bimestral)}
                </TableCell>
                <TableCell className={cn("text-right text-lg", getNotaColor(nota.promedio))}>
                  {formatNota(nota.promedio)}
                </TableCell>
                <TableCell>
                  {nota.promedio !== null ? (
                    <MiniProgressBar value={nota.promedio} className="mt-1" />
                  ) : (
                    <span className="text-slate-400 text-sm">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
