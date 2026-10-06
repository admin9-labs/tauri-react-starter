import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type NativeSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  sectionClassName?: string;
};

function NativeSelect({
  className,
  sectionClassName,
  children,
  ...props
}: NativeSelectProps) {
  return (
    <span className={cn("relative block w-full min-w-0", sectionClassName)}>
      <select
        data-slot="native-select"
        className={cn(
          "ui-control-field ui-control-capsule ui-type-caption h-9 w-full min-w-0 cursor-pointer appearance-none px-3.5 pr-9",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-text-disabled"
        aria-hidden="true"
      />
    </span>
  );
}

export { NativeSelect };
