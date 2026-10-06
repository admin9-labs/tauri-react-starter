import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type AppBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const badgeVariants = cva(
  "ui-control-pill ui-type-caption inline-flex h-auto items-center border px-2.5 py-1 leading-none normal-case",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent text-primary",
        secondary: "border-transparent bg-surface-active text-text-secondary",
        destructive: "border-transparent bg-destructive-muted text-destructive",
        outline: "border-border-control bg-transparent text-text-secondary",
        m0: "border-transparent bg-panel-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

function Badge({ className, variant = "default", ...props }: AppBadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
export type { BadgeVariant };
