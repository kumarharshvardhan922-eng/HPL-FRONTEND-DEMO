import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "./button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Unable to load data",
  message = "An error occurred while fetching details. Please check your connection or retry.",
  onRetry,
}) => {
  return (
    <div role="alert" className="w-full flex flex-col items-center justify-center p-8 text-center bg-hpl-surface rounded-2xl border border-hpl-live/40 shadow-card">
      <div className="w-12 h-12 rounded-2xl bg-hpl-live/20 text-hpl-live flex items-center justify-center mb-3 border border-hpl-live/30">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-white font-display">{title}</h3>
      <p className="text-xs sm:text-sm text-hpl-muted max-w-sm mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="border-hpl-live/40 text-red-300 hover:bg-hpl-surface-2">
          <RotateCcw className="w-4 h-4 mr-1.5" />
          Retry
        </Button>
      )}
    </div>
  );
};
