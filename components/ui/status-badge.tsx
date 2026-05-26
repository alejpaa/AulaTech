import { Badge } from "@/components/ui/badge";

type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "info";

type StatusBadgeProps = {
  status: string | null | undefined;
  variant?: BadgeVariant;
  className?: string;
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const label = status ?? "";
  const resolved = variant ?? (label === "REUNIÓN" ? "warning" : "neutral");
  const resolvedForBadge: "neutral" | "success" | "warning" | "danger" =
    resolved === "info" ? "neutral" : (resolved as "neutral" | "success" | "warning" | "danger");

  return <Badge variant={resolvedForBadge} className={className}>{label}</Badge>;
}
