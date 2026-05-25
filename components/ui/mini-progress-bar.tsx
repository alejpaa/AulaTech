import { cn } from "@/lib/utils/cn";

interface MiniProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

export function MiniProgressBar({ value, max = 20, className }: MiniProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  let colorClass = "bg-blue-500";
  if (value >= 11) colorClass = "bg-green-500";
  else if (value < 10) colorClass = "bg-red-500";
  else colorClass = "bg-orange-500";

  return (
    <div className={cn("h-2 w-full bg-slate-100 rounded-full overflow-hidden", className)}>
      <div 
        className={cn("h-full rounded-full transition-all duration-500", colorClass)} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
