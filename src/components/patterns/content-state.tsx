import type { ReactNode } from "react";

import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  variant?: "panel" | "inline";
};

export function EmptyState({
  title,
  description,
  action,
  className,
  contentClassName,
  variant = "panel",
}: EmptyStateProps) {
  return (
    <div className={cn("grid place-items-center text-center", className)}>
      <div
        className={cn(
          "flex max-w-sm flex-col items-center gap-3 px-6 py-5",
          variant === "panel" && "ui-surface-card bg-material-panel-elevated",
          variant === "inline" && "rounded-none bg-transparent shadow-none",
          contentClassName,
        )}
      >
        <div className="space-y-1.5">
          <Text variant="bodyStrong">{title}</Text>
          <Text variant="caption">{description}</Text>
        </div>
        {action}
      </div>
    </div>
  );
}

type ErrorStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({
  title,
  description,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn("ui-surface-muted space-y-3 p-4", className)}
    >
      <div className="space-y-1.5">
        <Text variant="bodyStrong" className="text-destructive">
          {title}
        </Text>
        <Text variant="caption">{description}</Text>
      </div>
      {action}
    </div>
  );
}
