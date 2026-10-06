import type { AnchorHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type RecordListHeaderProps = {
  children: ReactNode;
  className?: string;
};

function RecordListHeader({ children, className }: RecordListHeaderProps) {
  return (
    <div
      data-slot="record-list-header"
      className={cn(
        "ui-type-nav grid border-b border-separator bg-material-toolbar/80 px-5 py-2.5 text-label",
        className,
      )}
    >
      {children}
    </div>
  );
}

type RecordListFooterProps = {
  children: ReactNode;
  className?: string;
};

function RecordListFooter({ children, className }: RecordListFooterProps) {
  return (
    <div
      data-slot="record-list-footer"
      className={cn(
        "ui-type-nav border-t border-separator bg-material-toolbar/80 px-5 py-2.5 text-label",
        className,
      )}
    >
      {children}
    </div>
  );
}

type RecordListItemProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  active?: boolean;
};

function RecordListItem({
  active = false,
  className,
  ...props
}: RecordListItemProps) {
  return (
    <a
      data-slot="record-list-item"
      data-active={active ? "true" : undefined}
      className={cn(
        "native-record-list-item grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-4 px-5 py-3 text-left outline-none transition-colors",
        active && "bg-list-selection",
        className,
      )}
      {...props}
    />
  );
}

export { RecordListFooter, RecordListHeader, RecordListItem };
