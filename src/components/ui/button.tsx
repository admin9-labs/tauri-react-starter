import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "ui-pressable inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap bg-clip-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:active:transform-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "box-border border-0 bg-primary text-primary-foreground shadow-none hover:bg-primary-focus",
        destructive:
          "box-border border-0 bg-destructive text-white shadow-none hover:brightness-95",
        outline:
          "box-border border border-primary bg-transparent text-primary shadow-none hover:bg-accent",
        secondary:
          "box-border border border-border-control bg-surface-pearl text-text-secondary shadow-none hover:bg-control-fill-hover hover:text-foreground",
        toolbar: "box-border ui-toolbar-button-chrome text-text-secondary",
        ghost:
          "box-border border border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-surface-active hover:text-foreground",
        link: "bg-transparent p-0 text-primary shadow-none underline-offset-4 hover:underline active:transform-none",
      },
      size: {
        default:
          "ui-control-pill ui-type-caption min-h-9 px-4 py-2 leading-none",
        sm: "ui-control-pill ui-type-caption min-h-8 px-3 py-1.5 leading-none",
        toolbar: "ui-toolbar-button",
        lg: "ui-control-pill ui-type-body min-h-11 px-5 py-2.5 font-light leading-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonSize, ButtonVariant };
