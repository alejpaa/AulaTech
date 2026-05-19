import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

type FilterPanelProps = {
  children: ReactNode;
};

export function FilterPanel({ children }: FilterPanelProps) {
  return (
    <Card className="mb-5">
      <CardContent className="grid gap-4 py-4 sm:grid-cols-2 lg:grid-cols-4">{children}</CardContent>
    </Card>
  );
}
