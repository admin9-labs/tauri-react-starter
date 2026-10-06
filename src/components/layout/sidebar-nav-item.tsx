import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SidebarNavItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  onNavigate?: (href: string) => void;
};

export function SidebarNavItem({
  href,
  label,
  icon: Icon,
  active = false,
  onNavigate,
}: SidebarNavItemProps) {
  return (
    <a
      href={href}
      aria-label={label}
      onClick={() => {
        onNavigate?.(href);
      }}
      className={cn(
        "ui-control-interactive ui-control-utility ui-type-caption group flex min-h-9 cursor-pointer items-center gap-2 px-3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "native-sidebar-active text-primary shadow-none hover:text-primary"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded transition-colors",
          active
            ? "text-primary"
            : "text-text-disabled group-hover:text-foreground",
        )}
      >
        <Icon className="size-[14px]" aria-hidden="true" />
      </span>
      <span className="min-w-0 truncate">{label}</span>
    </a>
  );
}
