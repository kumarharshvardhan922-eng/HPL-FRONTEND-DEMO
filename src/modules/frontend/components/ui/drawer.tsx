"use client";

import React, { useEffect } from "react";
import { cn } from "../../utils/cn";
import { X } from "lucide-react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  side?: "left" | "right";
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  side = "right",
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-black/70 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className={cn(
          "relative z-10 w-full max-w-md bg-hpl-surface text-white shadow-2xl border-l border-hpl-border flex flex-col h-full transform transition-transform duration-300 ease-in-out",
          side === "left" ? "mr-auto animate-in slide-in-from-left" : "ml-auto animate-in slide-in-from-right"
        )}
      >
        <div className="p-5 border-b border-hpl-border flex items-center justify-between bg-hpl-surface-2">
          <h2 className="text-base font-bold text-white font-display">{title || "Menu"}</h2>
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1 rounded-lg text-hpl-muted hover:text-white hover:bg-hpl-surface"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
