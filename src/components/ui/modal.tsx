import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Heading } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type ModalClassNames = {
  content?: string;
  header?: string;
  title?: string;
  body?: string;
  close?: string;
};

type ModalProps = {
  opened: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  classNames?: ModalClassNames;
  closeButtonProps?: ComponentPropsWithoutRef<"button">;
};

const modalSizeClassName: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

function Modal({
  opened,
  onClose,
  title,
  children,
  size = "md",
  classNames,
  closeButtonProps,
}: ModalProps) {
  return (
    <DialogPrimitive.Root
      open={opened}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-overlay backdrop-blur-md data-[state=closed]:animate-out data-[state=open]:animate-in" />
        <DialogPrimitive.Content
          className={cn(
            "ui-modal-surface fixed left-1/2 top-1/2 z-50 max-h-[85dvh] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden outline-none",
            modalSizeClassName[size],
            classNames?.content,
          )}
        >
          <div
            className={cn(
              "flex min-h-[52px] items-center justify-between gap-4 border-b border-separator bg-material-toolbar/80 px-5 backdrop-blur-xl",
              classNames?.header,
            )}
          >
            <DialogPrimitive.Title asChild>
              <Heading
                level={2}
                variant="title"
                className={cn("text-foreground", classNames?.title)}
              >
                {title}
              </Heading>
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              className={cn(
                "ui-pressable inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-surface-active hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                classNames?.close,
              )}
              {...closeButtonProps}
            >
              <X className="size-4" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>
          <div className={cn("px-5 pb-5 pt-5", classNames?.body)}>
            <DialogPrimitive.Description className="sr-only">
              {typeof title === "string" ? title : "Dialog content"}
            </DialogPrimitive.Description>
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { Modal };
