"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";
import {
  Megaphone,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  CreditCard,
  User,
  CalendarCheck,
  LayoutDashboard,
  LucideIcon
} from "lucide-react";

type SidebarNavProps = {
  items: NavigationItem[];
};

const iconMap: Record<string, LucideIcon> = {
  Megaphone,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  CreditCard,
  User,
  CalendarCheck,
  LayoutDashboard,
};

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="mt-8 space-y-1">
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/alumno" && item.href !== "/profesor" && item.href !== "/admin" && item.href !== "/padre" && pathname.startsWith(`${item.href}/`));
        const Icon = iconMap[item.icon];

        return (
          <Link
            className={cn(
              "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active 
                ? "bg-blue-500 text-white" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
            )}
            href={item.href}
            key={item.href}
          >
            <div className="flex items-center gap-3">
              {Icon && (
                <Icon className={cn("h-5 w-5", active ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
              )}
              {item.title}
            </div>
            {item.badge !== undefined && (
              <span
                className={cn(
                  "flex h-5 items-center justify-center rounded-full px-2 text-[10px] font-bold",
                  active
                    ? "bg-white text-blue-500"
                    : item.badge > 0
                    ? "bg-red-500 text-white"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {item.badge > 99 ? "99+" : item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
