import type { ReactNode } from "react";

import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type PropertyGridProps = {
  children: ReactNode;
  className?: string;
};

export function PropertyGrid({ children, className }: PropertyGridProps) {
  return <div className={cn("grid gap-4", className)}>{children}</div>;
}

type PropertyItemProps = {
  label: string;
  children: ReactNode;
  icon?: ReactNode;
  tone?: "default" | "danger";
};

export function PropertyItem({
  label,
  children,
  icon,
  tone = "default",
}: PropertyItemProps) {
  return (
    <div
      className={cn(
        "ui-surface-card bg-material-panel-elevated p-5",
        tone === "danger"
          ? "border-destructive-border bg-destructive-muted"
          : "border-border-subtle",
      )}
    >
      {icon ? <div className="mb-4 text-muted-foreground">{icon}</div> : null}
      <Text
        variant="caption"
        className={cn(
          "mb-1",
          tone === "danger" ? "text-destructive-label" : undefined,
        )}
      >
        {label}
      </Text>
      {children}
    </div>
  );
}
