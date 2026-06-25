import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "./Icon";
import { Button } from "./ui";
import { ar } from "../lib/i18n";

export function Modal({
  open,
  onClose,
  title,
  children,
  width = 480,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    ref.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90vh] w-full overflow-auto rounded-2xl bg-white shadow-2xl outline-none"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h3 className="text-[17px] font-bold text-ink">{title}</h3>
          <button
            onClick={onClose}
            className="flex p-1 text-muted hover:text-ink"
            aria-label={ar.cancel}
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = ar.confirm,
  message,
  confirmLabel = ar.confirm,
  danger = true,
  busy = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  busy?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} width={380}>
      <p className="mb-6 text-sm leading-relaxed text-muted">{message}</p>
      <div className="flex justify-end gap-2.5">
        <Button variant="secondary" onClick={onClose} disabled={busy}>
          {ar.cancel}
        </Button>
        <Button
          variant={danger ? "danger" : "primary"}
          onClick={onConfirm}
          disabled={busy}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
