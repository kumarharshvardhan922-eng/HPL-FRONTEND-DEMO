import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "./button";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No records found",
  description = "There is currently no data available for this section.",
  icon,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-hpl-surface rounded-2xl border border-dashed border-hpl-border">
      <div className="w-14 h-14 rounded-2xl bg-hpl-surface-2 text-hpl-accent flex items-center justify-center mb-4 border border-hpl-border">
        {icon || <FolderOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-white font-display">{title}</h3>
      <p className="text-xs sm:text-sm text-hpl-muted max-w-sm mt-1 mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
