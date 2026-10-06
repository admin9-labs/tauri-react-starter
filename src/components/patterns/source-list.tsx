import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

import { SectionLabel } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type SourceListProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  children: ReactNode;
};

export function SourceList({
  title,
  children,
  className,
  ...props
}: SourceListProps) {
  return (
    <nav className={cn("space-y-1", className)} aria-label={title} {...props}>
      {title ? (
        <SectionLabel className="px-2 pb-1">{title}</SectionLabel>
      ) : null}
      {children}
    </nav>
  );
}

type SourceListItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: ReactNode;
  count?: ReactNode;
  icon?: ReactNode;
  active?: boolean;
};

export function SourceListItem({
  label,
  count,
  icon,
  active = false,
  className,
  ...props
}: SourceListItemProps) {
  return (
    <button
      type="button"
      data-slot="source-list-item"
      data-active={active ? "true" : undefined}
      className={cn(
        "ui-control-interactive ui-control-utility ui-pressable ui-type-caption flex min-h-9 w-full cursor-pointer items-center justify-between gap-2 px-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:active:transform-none",
        active
          ? "bg-list-selection text-foreground"
          : "text-text-secondary hover:text-foreground",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2">
        {icon ? (
          <span className={cn("text-label", active && "text-primary")}>
            {icon}
          </span>
        ) : null}
        <span className="truncate">{label}</span>
      </span>
      {count !== undefined ? (
        <span className="ui-type-nav text-label">{count}</span>
      ) : null}
    </button>
  );
}
