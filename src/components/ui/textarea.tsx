import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type AppTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  resize?: "none" | "both" | "horizontal" | "vertical";
};

function Textarea({
  className,
  resize = "vertical",
  ...props
}: AppTextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "ui-control-field ui-control-capsule ui-type-caption min-h-24 w-full min-w-0 px-3.5 py-2.5",
        resize === "none" && "resize-none",
        resize === "both" && "resize",
        resize === "horizontal" && "resize-x",
        resize === "vertical" && "resize-y",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
