import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type FormListProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

function FormList({ className, children, ...props }: FormListProps) {
  return (
    <div
      data-slot="form-list"
      className={cn("ui-surface-card overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
}

type FormListRowProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  align?: "center" | "start";
};

function FormListRow({
  className,
  children,
  align = "center",
  ...props
}: FormListRowProps) {
  return (
    <div
      data-slot="form-list-row"
      className={cn(
        "grid grid-cols-[7rem_minmax(0,1fr)] gap-4 border-b border-separator px-5 py-3 last:border-b-0",
        align === "center" ? "items-center" : "items-start",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type FormListFooterProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

function FormListFooter({
  className,
  children,
  ...props
}: FormListFooterProps) {
  return (
    <div
      data-slot="form-list-footer"
      className={cn(
        "flex flex-wrap justify-end gap-2 border-t border-separator bg-material-toolbar/80 px-5 py-3 backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { FormList, FormListFooter, FormListRow };
