import type { ReactNode } from "react";

import { Heading } from "@/components/ui/typography";

export type PageToolbarProps = {
  title: string;
  actions?: ReactNode;
};

export function PageToolbar({ title, actions }: PageToolbarProps) {
  return (
    <header
      className="relative z-10 h-[52px] shrink-0 bg-material-toolbar/80 shadow-[var(--shadow-toolbar)] backdrop-blur-2xl"
      data-page-toolbar
    >
      <div className="flex h-full w-full items-center justify-between gap-4 px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Heading level={1} variant="subtitle" className="truncate">
            {title}
          </Heading>
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
