"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className={cn(
          "w-full bg-hpl-surface text-white rounded-2xl shadow-2xl border border-hpl-border overflow-hidden flex flex-col max-h-[90vh]",
          sizeStyles[size]
        )}
      >
        {(title || description) && (
          <div className="p-5 pb-4 border-b border-hpl-border flex items-start justify-between bg-hpl-surface-2">
            <div>
              {title && <h2 className="text-lg font-bold text-white font-display">{title}</h2>}
              {description && <p className="text-xs text-hpl-muted mt-0.5">{description}</p>}
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1 rounded-xl text-hpl-muted hover:text-white hover:bg-hpl-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
