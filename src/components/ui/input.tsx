import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "ui-control-field ui-control-capsule ui-type-caption h-9 w-full min-w-0 px-3.5 py-2",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
