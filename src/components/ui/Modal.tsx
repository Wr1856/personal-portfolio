"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
  wide?: boolean;
};

/**
 * Accessible modal built on the native <dialog> element, which provides
 * focus trapping, Escape handling, and focus restoration for free.
 */
export function Modal({ open, onClose, labelledBy, children, wide }: ModalProps) {
  const t = useTranslations("common");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = useCallback(() => {
    document.body.style.overflow = "";
    onClose();
  }, [onClose]);

  function onBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) {
      handleClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      onClose={handleClose}
      onCancel={handleClose}
      onClick={onBackdropClick}
      className={`m-auto w-[calc(100vw-2rem)] bg-surface text-ivory shadow-2xl backdrop:bg-black/70 frame-editorial p-0 ${
        wide ? "max-w-3xl" : "max-w-lg"
      }`}
    >
      {open ? (
        <div className="relative max-h-[85vh] overflow-y-auto p-6 sm:p-8">
          <button
            type="button"
            onClick={handleClose}
            aria-label={t("close")}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center border border-line bg-surface text-muted hover:text-ivory focus-ring"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ×
            </span>
          </button>
          {children}
        </div>
      ) : null}
    </dialog>
  );
}
