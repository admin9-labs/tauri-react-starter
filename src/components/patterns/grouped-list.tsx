import type { HTMLAttributes, ReactNode } from "react";

import { SectionLabel, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type GroupedListProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  children: ReactNode;
};

export function GroupedList({
  title,
  children,
  className,
  ...props
}: GroupedListProps) {
  return (
    <section className={cn("space-y-2", className)} {...props}>
      {title ? (
        <SectionLabel as="h3" className="px-1">
          {title}
        </SectionLabel>
      ) : null}
      <div className="ui-surface-card overflow-hidden">{children}</div>
    </section>
  );
}

type GroupedListRowProps = HTMLAttributes<HTMLDivElement> & {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
};

export function GroupedListRow({
  icon,
  title,
  description,
  meta,
  action,
  className,
  ...props
}: GroupedListRowProps) {
  return (
    <div
      className={cn(
        "grid min-h-14 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-separator px-4 py-2.5 last:border-b-0",
        className,
      )}
      {...props}
    >
      {icon ? <div className="ui-icon-tile size-9">{icon}</div> : null}
      <div className="min-w-0">
        <Text as="div" variant="bodyStrong" className="truncate">
          {title}
        </Text>
        {description ? (
          <Text as="div" variant="caption" className="mt-1 truncate">
            {description}
          </Text>
        ) : null}
      </div>
      <Text as="div" variant="meta" className="flex min-w-0 items-center gap-2">
        {meta}
        {action}
      </Text>
    </div>
  );
}
