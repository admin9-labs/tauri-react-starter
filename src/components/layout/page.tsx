import type { HTMLAttributes, ReactNode } from "react";

import { PageToolbar } from "@/components/layout/PageToolbar";
import { cn } from "@/lib/utils";

type PageProps = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Page({ title, actions, children, className }: PageProps) {
  return (
    <div className={cn("relative flex min-h-0 flex-1 flex-col", className)}>
      <PageToolbar title={title} actions={actions} />
      {children}
    </div>
  );
}

type PageBodyProps = {
  children: ReactNode;
  maxWidth?: "3xl" | "7xl" | "full";
  className?: string;
  contentClassName?: string;
};

const pageBodyMaxWidthClassName: Record<
  NonNullable<PageBodyProps["maxWidth"]>,
  string
> = {
  "3xl": "max-w-3xl",
  "7xl": "max-w-7xl",
  full: "max-w-none",
};

export function PageBody({
  children,
  maxWidth = "7xl",
  className,
  contentClassName,
}: PageBodyProps) {
  const isFullWidth = maxWidth === "full";

  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-y-none",
        isFullWidth
          ? "overflow-x-hidden p-0"
          : "p-5 [scrollbar-gutter:stable] md:px-6 lg:px-8",
        className,
      )}
      data-page-body
    >
      <div
        className={cn(
          "mx-auto w-full",
          isFullWidth
            ? "h-full max-w-none"
            : pageBodyMaxWidthClassName[maxWidth],
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "elevated" | "table" | "overview";
};

const surfaceVariantClassName: Record<
  NonNullable<SurfaceProps["variant"]>,
  string
> = {
  default: "border-separator",
  elevated: "border-border-subtle bg-material-panel-elevated",
  table:
    "border-[length:var(--table-border-width)] border-[var(--table-border-color)] bg-material-panel",
  overview: "ui-surface-overview border-separator",
};

const surfaceBaseClassName: Record<
  NonNullable<SurfaceProps["variant"]>,
  string
> = {
  default: "ui-surface-card",
  elevated: "ui-surface-card",
  table: "overflow-hidden",
  overview: "ui-surface-overview",
};

export function Surface({
  className,
  children,
  variant = "default",
  ...props
}: SurfaceProps) {
  return (
    <div
      className={cn(
        "overflow-hidden backdrop-blur-xl",
        surfaceBaseClassName[variant],
        surfaceVariantClassName[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type SurfaceHeaderProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "toolbar" | "muted";
};

const surfaceHeaderVariantClassName: Record<
  NonNullable<SurfaceHeaderProps["variant"]>,
  string
> = {
  default: "",
  toolbar: "bg-material-toolbar",
  muted: "bg-panel-muted",
};

export function SurfaceHeader({
  children,
  className,
  variant = "default",
}: SurfaceHeaderProps) {
  return (
    <div
      className={cn(
        "border-b border-separator px-5 py-3.5",
        surfaceHeaderVariantClassName[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}

type SurfaceContentProps = {
  children: ReactNode;
  className?: string;
};

export function SurfaceContent({ children, className }: SurfaceContentProps) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function SurfaceDivider() {
  return <div className="h-px bg-border-subtle" />;
}
