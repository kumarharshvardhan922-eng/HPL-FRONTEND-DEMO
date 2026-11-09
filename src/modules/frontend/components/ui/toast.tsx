"use client";

import React from "react";
import { ToastMessage } from "../../hooks/use-toast";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../../utils/cn";

export interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            role="alert"
            className={cn(
              "pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 transform transition-all duration-200 animate-in slide-in-from-bottom-2 bg-hpl-surface text-white",
              isSuccess && "border-emerald-500/40 text-emerald-300",
              isError && "border-hpl-live/40 text-red-300",
              !isSuccess && !isError && "border-hpl-accent/40 text-hpl-accent"
            )}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-hpl-live" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-hpl-accent" />}
            </div>
            <div className="flex-1">
              {toast.title && <h4 className="text-sm font-bold text-white font-display">{toast.title}</h4>}
              <p className="text-xs text-hpl-muted mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 text-hpl-muted hover:text-white p-0.5 rounded-lg"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
