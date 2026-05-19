import { Card, CardContent } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-10 text-center">
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>
      </CardContent>
    </Card>
  );
}
