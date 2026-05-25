import { cn } from "@/lib/utils/cn";

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: "success" | "danger" | "warning" | "primary";
}

export function CircularProgress({
  value,
  max = 20,
  size = 120,
  strokeWidth = 10,
  className,
  color,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const offset = circumference - (percentage / 100) * circumference;

  let strokeColor = "text-blue-500";
  if (color === "success" || (!color && value >= 11)) strokeColor = "text-green-500";
  else if (color === "danger" || (!color && value < 10)) strokeColor = "text-red-500";
  else if (color === "warning" || (!color && value >= 10 && value < 11)) strokeColor = "text-orange-500";
  else if (color === "primary") strokeColor = "text-blue-500";

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-slate-100"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold text-slate-800">{value.toFixed(1)}</span>
        <span className="text-xs text-slate-500 uppercase font-semibold">/ {max}</span>
      </div>
    </div>
  );
}
