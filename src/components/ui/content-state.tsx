import { LoaderCircle } from "lucide-react";

import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type LoadingStateProps = {
  message?: string;
  className?: string;
};

export function LoadingState({
  message = "加载中...",
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("grid place-items-center text-center", className)}
    >
      <div className="flex flex-col items-center gap-2">
        <LoaderCircle
          className="size-4 animate-spin text-primary"
          aria-hidden="true"
        />
        <Text variant="caption">{message}</Text>
      </div>
    </div>
  );
}
