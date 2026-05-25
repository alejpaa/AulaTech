import { cn } from "@/lib/utils/cn";

interface StatusBadgeProps {
  status: string;
  variant?: "success" | "danger" | "warning" | "info" | "default";
  className?: string;
}

export function StatusBadge({ status, variant = "default", className }: StatusBadgeProps) {
  const variants = {
    success: "bg-green-100 text-green-700 border-green-200",
    danger: "bg-red-100 text-red-700 border-red-200",
    warning: "bg-orange-100 text-orange-700 border-orange-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
    default: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border inline-flex items-center justify-center", variants[variant], className)}>
      {status}
    </span>
  );
}
