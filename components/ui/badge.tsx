import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      neutral: "bg-slate-100 text-slate-700",
      success: "bg-emerald-100 text-emerald-700",
      warning: "bg-amber-100 text-amber-800",
      danger: "bg-red-100 text-red-700",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
