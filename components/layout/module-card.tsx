import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ModuleCardProps = {
  title: string;
  description: string;
  status?: string;
};

export function ModuleCard({ title, description, status = "Base lista" }: ModuleCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-500">Este modulo esta listo para mostrar informacion cuando existan registros.</p>
      </CardContent>
    </Card>
  );
}
