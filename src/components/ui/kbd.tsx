import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type KbdProps = HTMLAttributes<HTMLElement>;

export function Kbd({ className, ...props }: KbdProps) {
  return <kbd className={cn("ui-kbd", className)} {...props} />;
}
