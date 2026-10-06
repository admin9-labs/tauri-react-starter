import { useEffect } from "react";
import { toast } from "sonner";

export type FeedbackToastTone = "success" | "info" | "warning" | "error";

type FeedbackToastProps = {
  id?: string;
  tone: FeedbackToastTone;
  message: string;
  onClose?: () => void;
};

export function FeedbackToast({
  tone,
  message,
  id = message,
  onClose,
}: FeedbackToastProps) {
  const toastType = tone === "warning" ? "warning" : tone;

  useEffect(() => {
    toast[toastType](message, {
      id,
      onDismiss: onClose,
      onAutoClose: onClose,
    });
  }, [id, message, onClose, toastType]);

  return null;
}
