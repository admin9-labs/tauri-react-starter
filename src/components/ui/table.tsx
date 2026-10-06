import * as React from "react";

import { cn } from "@/lib/utils";

function TableContainer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-container"
      className={cn(
        "relative min-h-0 flex-1 overflow-auto overscroll-y-none",
        className,
      )}
      {...props}
    />
  );
}

function TableRoot({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <table
      data-slot="table"
      className={cn(
        "ui-type-caption w-full caption-bottom border-collapse text-text-secondary",
        className,
      )}
      {...props}
    />
  );
}

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <TableContainer>
      <TableRoot className={className} {...props} />
    </TableContainer>
  );
}

function TableColumnGroup({
  className,
  ...props
}: React.ComponentProps<"colgroup">) {
  return (
    <colgroup data-slot="table-column-group" className={className} {...props} />
  );
}

function TableColumn({ className, ...props }: React.ComponentProps<"col">) {
  return <col data-slot="table-column" className={className} {...props} />;
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "sticky top-0 z-10 bg-material-toolbar/90 backdrop-blur-xl [&_tr]:border-b-[length:var(--table-border-width)] [&_tr]:border-[var(--table-border-color)]",
        className,
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b-[length:var(--table-border-width)] border-[var(--table-border-color)] transition-colors hover:bg-list-selection active:bg-surface-active",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "ui-type-nav h-9 px-4 text-left align-middle text-label",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn("h-9 px-4 py-2 align-middle", className)}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("ui-type-caption mt-4 text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableColumn,
  TableColumnGroup,
  TableContainer,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
};
