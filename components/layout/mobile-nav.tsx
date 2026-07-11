"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

type MobileNavProps = {
  items: NavigationItem[];
};

export function MobileNav({ items }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-5 py-3 lg:hidden">
      {items.map((item) => {
        const active = pathname === item.href || (!["/alumno", "/profesor", "/admin", "/padre"].includes(item.href) && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            className={cn(
              "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-slate-600",
              active ? "bg-slate-950 text-white" : "bg-slate-100",
            )}
            href={item.href}
            key={item.href}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
