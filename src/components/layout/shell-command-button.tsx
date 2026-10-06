import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

type ShellCommandButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: ReactNode;
  icon?: ReactNode;
  meta?: ReactNode;
  shortcut?: string[];
};

function ShellCommandButton({
  label,
  icon,
  meta,
  shortcut,
  className,
  ...props
}: ShellCommandButtonProps) {
  return (
    <button
      type="button"
      data-slot="shell-command-button"
      className={cn(
        "ui-control-interactive ui-control-utility ui-pressable ui-type-caption flex min-h-9 w-full cursor-pointer items-center justify-between px-3 text-left text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:active:transform-none",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2">
        {icon}
        <span className="truncate">{label}</span>
      </span>
      {shortcut ? (
        <span className="flex items-center gap-1">
          {shortcut.map((key) => (
            <Kbd key={key}>{key}</Kbd>
          ))}
        </span>
      ) : (
        <span className="ui-type-nav text-label">{meta}</span>
      )}
    </button>
  );
}

export { ShellCommandButton };
