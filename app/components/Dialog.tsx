"use client";

import type { ComponentProps } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogPortal(props: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogOverlay({ className = "", onPointerDown, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={`fixed inset-0 z-50 bg-[rgba(32,30,29,.88)] backdrop-blur-[2px] transition-opacity duration-500 ease-out data-[ending-style]:pointer-events-none data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 ${className}`}
      {...props}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        event.stopPropagation();
      }}
    />
  );
}

type DialogContentProps = DialogPrimitive.Popup.Props & {
  onBackdropClick?: ComponentProps<"div">["onClick"];
};

function DialogContent({ className = "", children, onBackdropClick, onPointerDown, ...props }: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay onClick={onBackdropClick} />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={`fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 outline-none data-[ending-style]:pointer-events-none ${className}`}
        {...props}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          event.stopPropagation();
        }}
      >
        {children}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogTitle({ className = "", ...props }: DialogPrimitive.Title.Props) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={className} {...props} />;
}

function DialogDescription({ className = "", ...props }: DialogPrimitive.Description.Props) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={className} {...props} />;
}

function DialogHeader({ className = "", ...props }: ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={`flex flex-col ${className}`} {...props} />;
}

export type DialogActions = DialogPrimitive.Root.Actions;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
