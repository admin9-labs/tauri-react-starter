import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type CodeTextProps = HTMLAttributes<HTMLElement>;

function CodeText({ className, ...props }: CodeTextProps) {
  return (
    <code
      data-slot="code-text"
      className={cn("ui-code-text", className)}
      {...props}
    />
  );
}

export { CodeText };
