import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { MutedText } from "@/components/ui/typography";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "destructive";
  confirming?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "确认",
  cancelLabel = "取消",
  tone = "default",
  confirming = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal
      opened={open}
      onClose={onCancel}
      title={title}
      size="md"
      classNames={{
        body: "px-5 pb-5 pt-3",
      }}
      closeButtonProps={{
        "aria-label": "关闭确认弹窗",
      }}
    >
      <MutedText>{description}</MutedText>
      <div className="mt-5 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="toolbar"
          disabled={confirming}
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={tone === "destructive" ? "destructive" : "default"}
          size="toolbar"
          disabled={confirming}
          onClick={onConfirm}
        >
          {confirming ? "处理中..." : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
