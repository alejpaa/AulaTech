import Link from "next/link";
import type { NavigationItem } from "@/config/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ModuleGridProps = {
  items: NavigationItem[];
};

export function ModuleGrid({ items }: ModuleGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Link href={item.href} key={item.href}>
          <Card className="h-full transition-colors hover:border-slate-300 hover:bg-slate-50">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-sm font-medium text-slate-700">Abrir modulo</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
