import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">;

type ActionIconProps = NativeButtonProps & {
  variant?: ActionIconVariant;
};

const actionIconVariants = cva(
  "ui-pressable inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full box-border bg-clip-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:active:transform-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        ghost:
          "border border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-surface-active hover:text-foreground",
        default:
          "border border-transparent bg-surface-active text-foreground shadow-none hover:bg-control-fill-hover",
        destructive:
          "border border-transparent bg-transparent text-destructive shadow-none hover:bg-destructive-muted",
      },
    },
    defaultVariants: {
      variant: "ghost",
    },
  },
);

type ActionIconVariant = NonNullable<
  VariantProps<typeof actionIconVariants>["variant"]
>;

function ActionIcon({
  className,
  variant = "ghost",
  children,
  ...props
}: ActionIconProps) {
  return (
    <button
      data-slot="action-icon"
      data-variant={variant}
      className={cn(actionIconVariants({ variant }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

export { ActionIcon, actionIconVariants };
export type { ActionIconVariant };
