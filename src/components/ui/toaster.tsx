import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      offset={{ right: 16, bottom: 16 }}
      visibleToasts={3}
      toastOptions={{
        classNames: {
          toast:
            "ui-modal-surface border-border-control bg-card text-foreground",
          title: "ui-type-caption",
          description: "ui-type-nav text-muted-foreground",
          actionButton: "ui-control-pill bg-primary text-primary-foreground",
          cancelButton: "ui-control-pill bg-muted text-muted-foreground",
          closeButton:
            "rounded-full border-border-control bg-card text-muted-foreground",
        },
      }}
    />
  );
}
