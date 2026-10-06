import type { HTMLAttributes, ReactNode } from "react";

import { Heading, SectionLabel } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type InspectorPanelProps = HTMLAttributes<HTMLElement> & {
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  variant?: "embedded" | "floating";
};

export function InspectorPanel({
  title = "Inspector",
  children,
  footer,
  className,
  variant = "embedded",
  ...props
}: InspectorPanelProps) {
  return (
    <aside
      className={cn(
        "flex min-h-0 flex-col bg-material-panel",
        variant === "embedded"
          ? "border-l border-separator"
          : "ui-surface-card overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="flex h-[52px] shrink-0 items-center border-b border-separator bg-material-toolbar/80 px-5 backdrop-blur-xl">
        <Heading level={3} variant="title" className="truncate">
          {title}
        </Heading>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
      {footer ? (
        <div className="shrink-0 border-t border-separator bg-material-toolbar/80 p-4 backdrop-blur-xl">
          {footer}
        </div>
      ) : null}
    </aside>
  );
}

type InspectorSectionProps = HTMLAttributes<HTMLDivElement> & {
  title?: ReactNode;
  children: ReactNode;
};

export function InspectorSection({
  title,
  children,
  className,
  ...props
}: InspectorSectionProps) {
  return (
    <section className={cn("space-y-2", className)} {...props}>
      {title ? <SectionLabel as="h4">{title}</SectionLabel> : null}
      <div className="ui-surface-capsule border-separator p-4">{children}</div>
    </section>
  );
}

type InspectorFieldProps = HTMLAttributes<HTMLDivElement> & {
  label: ReactNode;
  value: ReactNode;
};

export function InspectorField({
  label,
  value,
  className,
  ...props
}: InspectorFieldProps) {
  return (
    <div
      className={cn(
        "ui-type-caption grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border-b border-separator py-2.5 last:border-b-0",
        className,
      )}
      {...props}
    >
      <span className="text-label">{label}</span>
      <span className="min-w-0 break-words text-text-secondary">{value}</span>
    </div>
  );
}
